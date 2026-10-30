// Contenido de las cinco áreas de servicio (documento fundacional, apartados 5, 6 y 8). Migrado sin cambios de la v1.

export const QUESTIONS = [
  { q: '¿Qué está ocurriendo?', discipline: 'Inteligencia de negocio', deliverable: 'Cuadro de mando con indicadores fiables y una única versión de la verdad.' },
  { q: '¿Por qué está ocurriendo?', discipline: 'Analítica y diagnóstico financiero', deliverable: 'Análisis de causas, desviaciones y rentabilidad real.' },
  { q: '¿Qué ocurrirá probablemente?', discipline: 'Analítica avanzada y forecast', deliverable: 'Modelos predictivos y simulación de escenarios.' },
  { q: '¿Qué decisión tomar?', discipline: 'Estrategia y finanzas', deliverable: 'Recomendación priorizada con impacto cuantificado.' },
  { q: '¿Cómo ejecutarla?', discipline: 'Tecnología e IA aplicada', deliverable: 'Automatización, hoja de ruta y acompañamiento hasta el resultado.' },
];

export type Service = {
  slug: string;
  name: string;
  subtitle: string;
  claim: string;
  intro: string;
  /** Índices de QUESTIONS a los que responde el área. */
  questions: number[];
  rows: [servicio: string, entregable: string, beneficio: string][];
};

export const SERVICES: Service[] = [
  {
    slug: 'inteligencia-de-negocio',
    name: 'Inteligencia de negocio',
    subtitle: 'Una visión fiable de la información.',
    claim: 'Una única versión de la verdad.',
    intro:
      'Convertimos información dispersa en conocimiento accionable: un catálogo de indicadores común y sin ambigüedad, y cuadros de mando orientados a la decisión, no a la exhibición.',
    questions: [0],
    rows: [
      ['Dashboards ejecutivos', 'Panel de dirección con los indicadores críticos', 'Una única versión de la verdad'],
      ['Cuadros de mando Power BI', 'Modelo de datos y visualizaciones en producción', 'Autonomía de consulta sin depender de terceros'],
      ['Definición de KPIs estratégicos', 'Catálogo de indicadores con definición y fuente', 'Un criterio común sobre qué mide cada cifra'],
      ['Reporting automatizado', 'Informes periódicos generados sin intervención manual', 'Menos tiempo dedicado a preparar informes'],
    ],
  },
  {
    slug: 'analitica-avanzada',
    name: 'Analítica avanzada',
    subtitle: 'Anticipar demanda, resultados y escenarios.',
    claim: 'Anticipar en lugar de reaccionar.',
    intro:
      'Creamos modelos predictivos y herramientas de simulación para detectar tendencias y anomalías, dimensionar recursos y cuantificar el riesgo antes de asumirlo.',
    questions: [2],
    rows: [
      ['Modelos predictivos', 'Modelo validado y documentado, con su medida de error', 'Anticipación en lugar de reacción'],
      ['Forecast financiero', 'Previsión de ingresos, costes y tesorería', 'Visibilidad sobre las próximas decisiones de caja'],
      ['Forecast operativo', 'Previsión de demanda, ocupación o carga de trabajo', 'Dimensionamiento ajustado de recursos'],
      ['Simulación de escenarios', 'Herramienta de sensibilidad sobre variables clave', 'Cuantificación del riesgo antes de asumirlo'],
    ],
  },
  {
    slug: 'consultoria-financiera',
    name: 'Consultoría financiera',
    subtitle: 'Entender rentabilidad, caja y decisiones de inversión.',
    claim: 'Rentabilidad real, decisiones sólidas.',
    intro:
      'Analizamos la rentabilidad por cliente, producto, línea de negocio o centro, construimos previsiones de resultados y tesorería y damos soporte a las decisiones de inversión y financiación.',
    questions: [1, 3],
    rows: [
      ['Modelización financiera', 'Modelo integrado de resultados, balance y caja', 'Base sólida para decidir e informar a terceros'],
      ['Planificación presupuestaria', 'Presupuesto anual y seguimiento de desviaciones', 'Control de gestión efectivo'],
      ['Rentabilidad por línea de negocio', 'Análisis de márgenes y asignación de costes', 'Decisiones de precio, foco y desinversión'],
      ['Tesorería', 'Previsión y gestión del circulante', 'Reducción de tensiones de liquidez'],
      ['Análisis de inversiones', 'Evaluación de proyectos y alternativas', 'Asignación eficiente del capital'],
    ],
  },
  {
    slug: 'transformacion-digital',
    name: 'Transformación digital',
    subtitle: 'Procesos y tecnología con criterio de negocio.',
    claim: 'Invertir con orden y sin sesgo de fabricante.',
    intro:
      'Seleccionamos herramientas con criterio de coste total y capacidad interna, diseñamos arquitecturas de información y rediseñamos y automatizamos los procesos que más tiempo consumen.',
    questions: [4],
    rows: [
      ['Diagnóstico digital', 'Informe de madurez y brechas priorizadas', 'Saber dónde se está antes de invertir'],
      ['Roadmap tecnológico', 'Plan por fases con coste, plazo y retorno', 'Inversión ordenada y defendible'],
      ['Selección de herramientas', 'Comparativa independiente y recomendación', 'Decisión sin sesgo de fabricante'],
      ['Gobierno del dato', 'Modelo de propiedad, calidad y acceso al dato', 'Información fiable y trazable'],
      ['Digitalización de procesos', 'Procesos rediseñados y automatizados', 'Menos error manual y más capacidad'],
    ],
  },
  {
    slug: 'inteligencia-artificial-aplicada',
    name: 'Inteligencia artificial aplicada',
    subtitle: 'Casos de uso con utilidad y retorno identificable.',
    claim: 'IA con criterio, no por moda.',
    intro:
      'Identificamos casos de uso reales, con retorno estimado antes de invertir, y aplicamos la inteligencia artificial como soporte —no sustituto— de la toma de decisiones.',
    questions: [4],
    rows: [
      ['Identificación de casos de uso', 'Cartera de casos priorizada por retorno y viabilidad', 'IA con criterio, no por moda'],
      ['Automatización documental', 'Extracción y tratamiento automático de documentos', 'Menos carga en tareas administrativas repetitivas'],
      ['Asistentes internos', 'Asistente sobre la documentación propia de la organización', 'Conocimiento interno más fácil de consultar'],
      ['IA para soporte a la decisión', 'Integración de la IA en los flujos de gestión', 'Mejor decisión en menos tiempo'],
      ['Formación ejecutiva', 'Programa a medida para dirección y equipos', 'Adopción real y uso responsable'],
    ],
  },
];

export const FIRMA_NAV = [
  { name: 'Quiénes somos', path: '/firma/quienes-somos', subtitle: 'La firma, cómo nos adaptamos y por qué elegirnos.' },
  { name: 'Método', path: '/firma/metodo', subtitle: 'Cinco fases, del problema a una solución funcionando.' },
  { name: 'Misión, visión y principios', path: '/firma/mision-vision-principios', subtitle: 'Lo que guía cada decisión y cada proyecto.' },
];
