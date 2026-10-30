// Contenido de la portada y de las páginas de la firma. Textos migrados sin cambios de los componentes de la v1
// (entre paréntesis, el componente de origen). Los identificadores H-/F- remiten a docs/01-inventario-y-auditoria-v1.md.

/** H-02 (Problem.astro) */
export const PROBLEM = {
  eyebrow: 'Negocio primero',
  title: 'Más herramientas no significan mejores decisiones.',
  lead: 'La tecnología solo aporta valor cuando responde a una pregunta de negocio. Sin esa pregunta, invertir más no garantiza decidir mejor.',
  scattered: ['Finanzas', 'Ventas', 'Operaciones', 'Mercado'],
  ordered: 'Una visión',
};

/** H-03 (Questions.astro) */
export const QUESTIONS_INTRO = {
  eyebrow: 'Cómo pensamos',
  title: 'Cinco preguntas, de la información a la decisión.',
  lead: 'Todo encargo, sea cual sea su envoltorio técnico, se ordena alrededor de estas preguntas. Se puede entrar por la primera y avanzar de forma natural hasta la última.',
};

/** H-04 (Capabilities.astro) */
export const CAPABILITIES_INTRO = {
  eyebrow: 'Capacidades',
  title: 'Cinco capacidades. Un mismo objetivo.',
  lead: 'Cada capacidad responde a una de las cinco preguntas. Juntas cubren el camino completo, de la información a la decisión.',
  center: 'Mejores decisiones',
};

/** Fases del método: objetivo (Method.astro) y resultado (MethodDetail.astro). */
export const PHASES = [
  { name: 'Diagnóstico', goal: 'Entender el negocio, las decisiones críticas y el estado real de la información.', result: 'Mapa de problemas priorizado y cuantificado' },
  { name: 'Diseño', goal: 'Definir indicadores, modelo de datos y solución objetivo.', result: 'Propuesta con alcance, plazo y retorno estimado' },
  { name: 'Construcción', goal: 'Desarrollar el modelo, el cuadro de mando o la automatización.', result: 'Solución en producción, documentada y trazable' },
  { name: 'Adopción', goal: 'Formar, acompañar y consolidar el cambio de hábito.', result: 'Uso real por parte del cliente, sin dependencia' },
  { name: 'Mejora continua', goal: 'Revisar, ampliar y ajustar con el negocio en marcha.', result: 'Relación recurrente y valor creciente' },
];

/** H-05 (Method.astro) */
export const METHOD_INTRO = {
  eyebrow: 'Método',
  title: 'Ningún proyecto termina en un informe.',
  lead: 'Termina en una decisión tomada y un proceso funcionando. El mismo método, sea cual sea el área de servicio.',
  more: 'Ver el método completo',
};

/** H-06 (Tailored.astro) */
export const TAILORED = {
  eyebrow: 'A la medida',
  title: 'Cada organización es distinta. Nuestro trabajo, también.',
  lead: 'No aplicamos soluciones de catálogo. Adaptamos el alcance, el ritmo y la forma de trabajar a cada cliente.',
  points: [
    {
      t: 'Al tamaño y al presupuesto',
      d: 'Dimensionamos cada encargo según la organización. Empezamos por un encargo acotado que resuelva un problema visible y ampliamos cuando el valor está demostrado.',
    },
    {
      t: 'A la forma de colaborar',
      d: 'Elegimos juntos la modalidad que mejor encaja con su situación.',
      modes: ['Proyecto cerrado', 'Servicio recurrente', 'Formación'],
    },
    {
      t: 'Al sector y al contexto',
      d: 'No es lo mismo una empresa familiar que una cooperativa o un ayuntamiento. Partimos de sus decisiones críticas, no de una plantilla.',
    },
    {
      t: 'A las herramientas que ya tiene',
      d: 'Aprovechamos lo que ya funciona. Solo recomendamos una herramienta nueva cuando responde a una pregunta de negocio.',
    },
  ] as { t: string; d: string; modes?: string[] }[],
};

/** F-01 (quienes-somos.astro) */
export const ABOUT_HERO = {
  kicker: 'La firma · Quiénes somos',
  title: 'Integramos lo que otros ofrecen por separado.',
  lead: 'Ayudamos a empresas y administraciones a decidir con evidencia, anticipación y criterio económico. No vendemos tecnología ni informes: vendemos capacidad de decisión.',
};

/** F-02 (Disciplines.astro) */
export const DISCIPLINES = {
  eyebrow: 'Qué hacemos',
  title: 'Estrategia, finanzas, datos, tecnología e IA en la misma mesa.',
  lead: 'Cada disciplina aporta una parte de la respuesta. Por eso trabajan juntas desde el primer día y convergen en un único resultado.',
  result: 'Capacidad de decisión',
  items: [
    { t: 'Estrategia', items: ['Objetivos traducidos a indicadores medibles', 'Priorización según impacto y esfuerzo', 'Hojas de ruta con hitos y responsables'] },
    { t: 'Finanzas', items: ['Rentabilidad por cliente, producto o línea', 'Previsiones de resultados y tesorería', 'Soporte a decisiones de inversión'] },
    { t: 'Datos', items: ['Información dispersa convertida en conocimiento', 'Indicadores comunes y sin ambigüedad', 'Modelos predictivos y detección de anomalías'] },
    { t: 'Tecnología', items: ['Herramientas elegidas por coste total', 'Arquitecturas de información e integración', 'Automatización de flujos de trabajo'] },
    { t: 'Inteligencia artificial', items: ['Casos de uso con retorno estimado', 'Asistentes sobre conocimiento propio', 'IA como soporte, no sustituto, de la decisión'] },
  ],
};

/** F-03 (Symptoms.astro) */
export const SYMPTOMS = {
  eyebrow: 'El punto de partida',
  title: 'Cinco problemas de fondo que abordamos.',
  lead: 'Ninguno se resuelve comprando una herramienta.',
  items: [
    { s: 'Mucha información, poco conocimiento', c: 'Datos dispersos en sistemas que no se hablan entre sí.', q: 'Se dedica más tiempo a construir el dato que a analizarlo.' },
    { s: 'Inversión tecnológica sin retorno', c: 'Se compra la herramienta antes de definir la pregunta de negocio.', q: 'Licencias infrautilizadas y escepticismo interno.' },
    { s: 'Decisiones basadas en intuición', c: 'Ausencia de indicadores fiables y compartidos.', q: 'Alta variabilidad en la calidad de las decisiones.' },
    { s: 'Visión fragmentada', c: 'Negocio, finanzas y tecnología operan en compartimentos.', q: 'Iniciativas que no se traducen en resultado económico.' },
    { s: 'Gestión reactiva', c: 'Sin capacidad predictiva ni de simulación.', q: 'Se corrige tarde y a mayor coste.' },
  ],
};

/** F-04 (WhyNow.astro) */
export const WHY_NOW = {
  eyebrow: 'Por qué ahora',
  title: 'El ritmo de cambio ya no permite gestionar mirando por el retrovisor.',
  items: [
    { k: 'IA', t: 'Automatizar ya no es exclusivo de la gran empresa', d: 'La inteligencia artificial ha abaratado la automatización de muchas tareas analíticas y documentales.' },
    { k: 'Fondos', t: 'Hay presupuesto, falta criterio', d: 'Los programas públicos de digitalización han generado presupuesto y, con él, la necesidad de un criterio independiente para orientarlo bien.' },
    { k: 'Reporting', t: 'Más exigencia de información', d: 'Sostenibilidad, transparencia y control financiero obligan a estructurar información que hoy está dispersa.' },
    { k: 'Remoto', t: 'Cercanía sin estructura física', d: 'El trabajo en remoto permite acompañar a cada organización de forma continua, esté donde esté.' },
  ],
};

/** F-05 (Why.astro) */
export const WHY = {
  eyebrow: 'Por qué nosotros',
  title: 'El diferencial no es la herramienta. Es el criterio.',
  lead: 'Nuestro enfoque es integrar estas disciplinas, con interlocución directa y sin intermediarios.',
  featured: {
    t: 'A la medida de cada organización',
    d: 'Adaptamos el alcance, el ritmo y la forma de colaborar al tamaño, al contexto y a las herramientas de cada cliente. No aplicamos soluciones de catálogo.',
  },
  reasons: [
    { t: 'Interlocución única y estable', d: 'Quien vende es quien ejecuta y quien responde. Sin cambios de interlocutor a mitad de proyecto.' },
    { t: 'Bilingüismo negocio–tecnología', d: 'Traducimos la necesidad de la dirección en una solución técnica sin pérdidas por el camino.' },
    { t: 'Estructura ligera', d: 'Un método de trabajo estructurado, sin capas intermedias entre usted y quien hace el trabajo.' },
    { t: 'Rapidez de decisión', d: 'Ciclos cortos de propuesta y arranque. De la primera conversación al trabajo en marcha, sin burocracia.' },
    { t: 'Conocimiento del contexto', d: 'Entendemos cómo funcionan una pyme, una empresa familiar o una entidad local por dentro.' },
    { t: 'Impacto medible', d: 'Acordamos con cada cliente cómo medir el resultado: horas liberadas, margen recuperado o decisiones anticipadas.' },
  ],
};

/** F-07 (metodo.astro) */
export const METHOD_HERO = {
  kicker: 'La firma · Método',
  title: 'Del problema a una solución funcionando.',
  lead: 'Toda intervención sigue el mismo método, sea cual sea el área de servicio. El objetivo es que ningún proyecto termine en un informe, sino en una decisión tomada y un proceso funcionando.',
};

/** F-08 (MethodDetail.astro) */
export const METHOD_DETAIL = {
  eyebrow: 'Las cinco fases',
  title: 'Cada fase termina con algo tangible.',
  rules: [
    'Valor visible en las primeras semanas. Nunca esperar al final del proyecto.',
    'Dejar al cliente más capaz de lo que era, aunque eso reduzca su dependencia de nosotros.',
  ],
};

/** F-09 (Journey.astro) */
export const JOURNEY = {
  eyebrow: 'La relación',
  title: 'Empezamos pequeño. Crecemos cuando el valor está demostrado.',
  lead: 'Nadie tiene que comprometerse con un gran proyecto para empezar. Así suele evolucionar la relación con una organización.',
  stages: [
    { t: 'Entrada', d: 'Un encargo acotado que resuelve un problema visible y demuestra capacidad.' },
    { t: 'Ampliación', d: 'El alcance se extiende a otras áreas o procesos de la organización.' },
    { t: 'Recurrencia', d: 'La relación se convierte en un servicio continuo con dedicación pactada.' },
    { t: 'Socio estratégico', d: 'Participamos en las decisiones de inversión, expansión y transformación.' },
  ],
};

/** F-11 a F-13 (mision-vision-principios.astro) */
export const PURPOSE = {
  hero: { kicker: 'La firma · Misión, visión y principios', title: 'Lo que guía cada decisión y cada proyecto.' },
  mission: {
    eyebrow: 'Misión',
    // Las partes con `em: true` iban en cursiva en la v1.
    parts: [
      { text: 'Ayudar a empresas y administraciones públicas a transformar ' },
      { text: 'la incertidumbre en estrategia', em: true },
      { text: ', ' },
      { text: 'los datos en oportunidades', em: true },
      { text: ' y ' },
      { text: 'la tecnología en una ventaja competitiva', em: true },
      { text: ' real y sostenible.' },
    ] as { text: string; em?: boolean }[],
  },
  vision: {
    eyebrow: 'Visión',
    title: 'El socio estratégico en las decisiones que importan.',
    lead: 'Convertirnos en la firma de referencia para la toma de decisiones basada en datos, integrando estrategia, finanzas, tecnología e inteligencia artificial para impulsar la competitividad y la sostenibilidad de organizaciones públicas y privadas.',
    label: 'Acompañamos las decisiones donde confluyen',
    confluences: [
      'Datos e información',
      'Rendimiento económico y financiero',
      'Tecnología y arquitectura de sistemas',
      'Eficiencia operativa',
      'Transformación organizativa y cultural',
    ],
  },
  principles: {
    eyebrow: 'Principios de actuación',
    title: 'Seis principios, sin excepciones.',
    items: [
      { t: 'Negocio primero', d: 'Ninguna solución técnica se propone sin una pregunta de negocio y un impacto económico asociado.' },
      { t: 'Independencia tecnológica', d: 'No hay comisiones de fabricante: se recomienda la herramienta que conviene al cliente, no la que conviene al proveedor.' },
      { t: 'Rigor analítico', d: 'Toda cifra entregada es trazable hasta su fuente y reproducible.' },
      { t: 'Transferencia de capacidad', d: 'El cliente debe quedar más autónomo después del proyecto, no más dependiente.' },
      { t: 'Pragmatismo', d: 'Antes un cuadro de mando en producción en seis semanas que una arquitectura perfecta en dieciocho meses.' },
      { t: 'Confidencialidad y gobierno del dato', d: 'Tratamiento de la información conforme a normativa y con criterios de seguridad desde el diseño.' },
    ],
  },
};

/** Textos de cierre por página (Closing.astro y props de cada página de la v1). */
export const CLOSINGS = {
  default: {
    kicker: 'Primer paso',
    title: 'Hablemos de la decisión que hoy le quita más tiempo.',
    text: 'Una primera conversación para entender su organización, sus decisiones críticas y el estado real de su información.',
  },
  about: {
    kicker: 'Conózcanos',
    title: 'La mejor forma de saber cómo trabajamos es una primera conversación.',
    text: 'Cuéntenos qué decisión quiere mejorar y le diremos, con franqueza, si podemos ayudarle.',
  },
  method: {
    kicker: 'Fase 1',
    title: 'Todo empieza entendiendo bien el problema.',
    text: 'En la sesión inicial revisamos sus decisiones críticas y el estado de su información.',
  },
  purpose: {
    kicker: 'Trabajemos juntos',
    title: 'Si comparte estos principios, tenemos mucho de qué hablar.',
    text: 'Una primera conversación para conocer su organización y ver dónde podemos aportar.',
  },
  service: (name: string) => ({
    kicker: name,
    title: '¿Le suena alguno de estos problemas? Hablemos de su caso.',
    text: `En una primera conversación vemos qué parte de ${name.toLowerCase()} tendría más impacto en su organización.`,
  }),
};

/** Textos destacados de los menús (Header.astro). */
export const MENU_FEATURES = {
  servicios: { kicker: 'Cinco áreas, una lógica', text: 'El producto no es la herramienta. El producto es la capacidad de decisión.' },
  firma: { kicker: 'Trenchs Advisory', text: 'Estrategia, finanzas, datos y tecnología, integrados para decidir mejor.' },
};

/** Lema (Hero.astro y Footer.astro). */
export const TAGLINE = ['Decisiones más inteligentes.', 'Organizaciones más competitivas.'];
