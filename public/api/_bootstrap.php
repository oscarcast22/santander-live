<?php
declare(strict_types=1);

function respond(int $status, array $payload): never
{
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
  exit;
}

function request_error(string $message, int $status = 422): never
{
  respond($status, ['ok' => false, 'message' => $message]);
}

function ensure_request(): void
{
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    request_error('Método no permitido.', 405);
  }

  $allowedOrigin = 'https://santanderlive.uad.mx';
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $referer = $_SERVER['HTTP_REFERER'] ?? '';
  if ($origin !== '' && $origin !== $allowedOrigin) {
    request_error('Origen no permitido.', 403);
  }
  if ($origin === '' && $referer !== '') {
    $parts = parse_url($referer);
    $refererOrigin = is_array($parts)
      ? ($parts['scheme'] ?? '') . '://' . ($parts['host'] ?? '') . (isset($parts['port']) ? ':' . $parts['port'] : '')
      : '';
    if ($refererOrigin !== $allowedOrigin) {
      request_error('Origen no permitido.', 403);
    }
  }

  $honeypot = $_POST['bot-field'] ?? '';
  if (!is_string($honeypot)) {
    request_error('No fue posible validar el envío.');
  }
  if ($honeypot !== '') {
    // Respond normally without sending mail when a bot fills this field.
    respond(200, ['ok' => true]);
  }

  $startedAt = $_POST['form_started_at'] ?? '';
  $startedAt = is_string($startedAt) ? filter_var($startedAt, FILTER_VALIDATE_INT) : false;
  $elapsed = $startedAt !== false ? (int) floor(microtime(true) * 1000) - $startedAt : 0;
  if ($startedAt === false || $startedAt < 1 || $elapsed < 1800) {
    request_error('No fue posible validar el envío. Inténtalo nuevamente.', 429);
  }

  enforce_rate_limit();
}

function enforce_rate_limit(): void
{
  $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  // Hash IPs and keep this site's throttle separate from UAD Virtual and other installs.
  $key = hash_hmac('sha256', $ip, 'santanderlive-cpanel-direct-mail-v1');
  $path = sys_get_temp_dir() . '/santanderlive-form-rate-' . hash('sha256', __DIR__) . '.json';
  $now = time();
  $handle = fopen($path, 'c+');
  if ($handle === false) {
    request_error('No fue posible procesar el envío. Inténtalo nuevamente.', 503);
  }

  try {
    if (!flock($handle, LOCK_EX)) {
      request_error('No fue posible procesar el envío. Inténtalo nuevamente.', 503);
    }
    $contents = stream_get_contents($handle);
    if ($contents === false) {
      request_error('No fue posible procesar el envío. Inténtalo nuevamente.', 503);
    }
    $entries = $contents !== '' ? json_decode($contents, true, 512, JSON_THROW_ON_ERROR) : [];
    if (!is_array($entries)) {
      throw new RuntimeException('El registro de envíos no es válido.');
    }
    foreach ($entries as $entryKey => $timestamps) {
      $entries[$entryKey] = array_values(array_filter((array) $timestamps, static fn ($timestamp) => is_int($timestamp) && $timestamp > $now - 900));
      if ($entries[$entryKey] === []) unset($entries[$entryKey]);
    }
    $timestamps = $entries[$key] ?? [];
    if (count($timestamps) >= 5) {
      request_error('Se han realizado demasiados envíos. Inténtalo de nuevo más tarde.', 429);
    }
    $timestamps[] = $now;
    $entries[$key] = $timestamps;
    $encoded = json_encode($entries, JSON_THROW_ON_ERROR);
    if (!rewind($handle) || !ftruncate($handle, 0) || fwrite($handle, $encoded) !== strlen($encoded) || !fflush($handle)) {
      request_error('No fue posible procesar el envío. Inténtalo nuevamente.', 503);
    }
  } finally {
    flock($handle, LOCK_UN);
    fclose($handle);
  }
}

function field(string $name, string $label, int $max): string
{
  $value = $_POST[$name] ?? '';
  if (!is_string($value) || !mb_check_encoding($value, 'UTF-8')) {
    request_error("El campo {$label} no es válido.");
  }
  $value = trim($value);
  if ($value === '') request_error("El campo {$label} es obligatorio.");
  if (mb_strlen($value, 'UTF-8') > $max) request_error("El campo {$label} es demasiado largo.");
  if (preg_match('/[\x00-\x1F\x7F]/u', $value)) request_error("El campo {$label} no es válido.");
  return $value;
}

function valid_email(string $value): string
{
  if (!filter_var($value, FILTER_VALIDATE_EMAIL)) request_error('Ingresa un correo electrónico válido.');
  return $value;
}

function required_consent(): void
{
  if (($_POST['privacidad'] ?? '') !== 'acepto') {
    request_error('Debes aceptar el aviso de privacidad para continuar.');
  }
}

function send_submission(array $fields, string $replyTo): void
{
  // mail() hands the message to the hosting transport; acceptance does not prove delivery.
  // This subdomain's published SPF authorizes the cPanel IP through its "a" mechanism.
  $from = 'formularios@santanderlive.uad.mx';
  $recipient = 'diseno.web@uad.mx';
  foreach ([$from, $recipient, $replyTo] as $address) {
    if (preg_match('/[\r\n]/', $address) || !filter_var($address, FILTER_VALIDATE_EMAIL)) {
      throw new RuntimeException('Dirección de correo no válida.');
    }
  }

  $lines = ['Nueva solicitud de información de Santander Live', ''];
  foreach ($fields as $label => $value) $lines[] = "{$label}: {$value}";
  $lines[] = '';
  $subject = '=?UTF-8?B?' . base64_encode('Santander Live: solicitud de información') . '?=';
  $headers = implode("\r\n", [
    'From: Santander Live <' . $from . '>',
    'Reply-To: ' . $replyTo,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
  ]);
  // Set the SMTP envelope too: a From header alone leaves cPanel's lobito.uad.mx sender.
  // This fixed address is not derived from submitted fields or request headers.
  if (!mail($recipient, $subject, implode("\r\n", $lines), $headers, '-f' . $from)) {
    throw new RuntimeException('El relay local rechazó el envío.');
  }
}
