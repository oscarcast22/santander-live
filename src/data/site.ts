export type ProgramLevel = 'licenciaturas' | 'posgrados';

export interface Program {
  slug: string;
  level: ProgramLevel;
  title: string;
  description?: string;
  model?: string[];
  curriculum?: string[];
  graduateProfile?: string[];
}

export const programs: Program[] = [
  {
    slug: 'arquitectura',
    level: 'licenciaturas',
    title: 'Arquitectura',
    description: 'Formar profesionales con la capacidad de poder desarrollar proyectos específicos arquitectónicos, urbanísticos así como, en su ejecución y dirección técnica con base a un conocimiento real de su entorno evaluado el impacto social, así como el papel que este juega en beneficio de su comunidad. Potenciando el Desarrollo Económico, Cultural, Artístico, Turístico, Urbano, etc.',
    model: [
      'El modelo educativo se ofrece como una opción que busca satisfacer la demanda educativa de un importante sector de la sociedad, integrado por personas a quienes se les dificulta llevar un plan escolarizado presencial, mediante un plan de estudios abierto y a distancia.',
      'Nuestro modelo educativo se sustenta en principios vigentes y probados de educación a distancia que privilegian el auto aprendizaje mediante el uso de la tecnología, con un enfoque formativo basado en competencias y ligado al desarrollo de habilidades y capacidades en áreas específicas del conocimiento.',
    ],
  },
  { slug: 'administracion-y-gestion-empresarial', level: 'licenciaturas', title: 'Administración y Gestión Empresarial' },
  { slug: 'ciencias-y-tecnicas-de-la-comunicacion', level: 'licenciaturas', title: 'Ciencias y Técnicas de la Comunicación' },
  { slug: 'contador-publico-auditor', level: 'licenciaturas', title: 'Contador Público Auditor' },
  { slug: 'criminologia', level: 'licenciaturas', title: 'Criminología' },
  { slug: 'diseno-multimedia', level: 'licenciaturas', title: 'Diseño Multimedia' },
  { slug: 'derecho', level: 'licenciaturas', title: 'Derecho' },
  { slug: 'fisioterapia', level: 'licenciaturas', title: 'Fisioterapia' },
  { slug: 'nutricion', level: 'licenciaturas', title: 'Nutrición' },
  { slug: 'psicologia', level: 'licenciaturas', title: 'Psicología' },
];

export const licensePrograms = programs.filter((program) => program.level === 'licenciaturas');
export const postgraduatePrograms = programs.filter((program) => program.level === 'posgrados');

export const aboutIntroduction = [
  'Fomento Educativo y Cultura Francisco de Ibarra A.C. es el organismo que da vida a nuestra casa de estudios de 11 de Febrero de 1992, fecha desde la cual trabajamos incansablemente, siempre apegados a los conceptos filosóficos que han guiado nuestro accionar, los cuales nos impulsan al cumplimiento de los objetivos que nos hemos propuesto, colaborar día con día a mejorar las condiciones generales de nuestra región y contribuir a desarrollo de nuestro país.',
  'La Universidad Autónoma de Durango pretende obtener un lugar en nuestra sociedad mediante el estímulo y fomento a la educación, a la cultura y a la investigación teniendo como elemento indispensable una visión hacia la excelencia que permita a los hombres de nuestra comunidad desarrollarse y vincularse productivamente con su país y con el exterior, crear en el seno de la comunidad universitaria hombres libres capaces de cambiar su entorno y manifestarse como personas útiles a su sociedad.',
];
