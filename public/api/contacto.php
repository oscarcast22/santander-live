<?php
declare(strict_types=1);
// Keep PHP warnings out of the JSON response, including when cPanel enables display_errors.
ini_set('display_errors', '0');
require __DIR__ . '/_bootstrap.php';

try {
  ensure_request();
  $nombre = field('nombre', 'Nombre', 120);
  $telefono = field('telefono', 'Teléfono', 40);
  $correo = valid_email(field('correo', 'Correo electrónico', 254));
  $programa = field('programa', 'Licenciatura o Posgrado', 160);
  required_consent();
  send_submission([
    'Nombre' => $nombre,
    'Teléfono' => $telefono,
    'Correo electrónico' => $correo,
    'Licenciatura o Posgrado' => $programa,
    'Aviso de privacidad' => 'Aceptado',
  ], $correo);
  respond(200, ['ok' => true]);
} catch (Throwable $exception) {
  error_log('Santander Live contacto: ' . $exception->getMessage());
  respond(500, ['ok' => false, 'message' => 'No fue posible enviar tu solicitud. Inténtalo nuevamente en unos minutos.']);
}
