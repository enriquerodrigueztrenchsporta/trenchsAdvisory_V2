// PYME Check: las cinco preguntas, sus opciones y lo que cada área significa en el diagnóstico.
// El orden de QUESTIONS es el orden de las preguntas y desempata las oportunidades.

/** Puntos de cada opción: A (solución completa), B (parcial), C (sin solución). */
export const POINTS = [10, 5, 0] as const;
export type Points = (typeof POINTS)[number];

export type AreaId = 'control' | 'profitability' | 'automation' | 'customers' | 'planning';

export type Question = {
  area: AreaId;
  /** Nombre del área en el dashboard. */
  areaName: string;
  /** Nombre del área dentro de una frase («… mejora en automatización y planificación»). */
  areaInline: string;
  question: string;
  /** Opciones A, B y C; puntúan POINTS[i]. */
  options: [string, string, string];
  /** Problema según la respuesta: C (0 puntos) es ausencia; B (5 puntos), margen de mejora u optimización. */
  problem: { none: string; partial: string };
  solution: { none: string; partial: string };
  /** Solución en forma breve, para el pop-up. */
  offer: string;
  service: string;
};

export const QUESTIONS: Question[] = [
  {
    area: 'control',
    areaName: 'Control del negocio',
    areaInline: 'control del negocio',
    question: '¿Cómo controlas las ventas y los resultados de tu empresa?',
    options: ['Con un dashboard actualizado.', 'Con Excel o informes ocasionales.', 'No llevo un seguimiento claro.'],
    problem: {
      none: 'Seguimiento limitado de los indicadores empresariales.',
      partial: 'El seguimiento con Excel o informes ocasionales puede ganar en frecuencia y fiabilidad.',
    },
    solution: {
      none: 'Implantar un dashboard de ventas, costes y márgenes con indicadores actualizados.',
      partial: 'Evolucionar los informes actuales hacia un dashboard de ventas, costes y márgenes con indicadores actualizados.',
    },
    offer: 'Dashboard de ventas, costes y márgenes.',
    service: 'Business Intelligence y dashboards empresariales',
  },
  {
    area: 'profitability',
    areaName: 'Rentabilidad',
    areaInline: 'rentabilidad',
    question: '¿Sabes qué productos o servicios son más rentables?',
    options: ['Sí, conozco sus márgenes.', 'Tengo una idea aproximada.', 'No lo sé.'],
    problem: {
      none: 'Conocimiento insuficiente de los márgenes por producto o servicio.',
      partial: 'Los márgenes por producto o servicio se conocen solo de forma aproximada.',
    },
    solution: {
      none: 'Desarrollar un análisis de rentabilidad por producto, servicio o cliente.',
      partial: 'Precisar la rentabilidad por producto, servicio o cliente con un análisis detallado de márgenes.',
    },
    offer: 'Análisis de rentabilidad por producto, servicio o cliente.',
    service: 'Consultoría financiera y análisis de rentabilidad',
  },
  {
    area: 'automation',
    areaName: 'Automatización',
    areaInline: 'automatización',
    question: '¿Cuánto trabajo administrativo haces manualmente?',
    options: ['Poco, tenemos procesos automatizados.', 'Algunas tareas son manuales.', 'Casi todo se hace manualmente.'],
    problem: {
      none: 'Procesos administrativos manuales.',
      partial: 'Algunas tareas administrativas siguen haciéndose a mano.',
    },
    solution: {
      none: 'Identificar tareas repetitivas y desarrollar automatizaciones para reducir el trabajo administrativo.',
      partial: 'Automatizar las tareas manuales que quedan para reducir aún más el trabajo administrativo.',
    },
    offer: 'Automatización de procesos administrativos.',
    service: 'Inteligencia Artificial Aplicada y automatización de procesos',
  },
  {
    area: 'customers',
    areaName: 'Analítica de clientes',
    areaInline: 'analítica de clientes',
    question: '¿Conoces qué clientes generan más ingresos?',
    options: ['Sí, tenemos esa información.', 'Solo parcialmente.', 'No lo analizamos.'],
    problem: {
      none: 'Falta de información detallada sobre el comportamiento y valor de los clientes.',
      partial: 'La información sobre el valor de cada cliente es parcial.',
    },
    solution: {
      none: 'Crear un sistema de segmentación y análisis de clientes para identificar patrones comerciales.',
      partial: 'Completar el análisis de clientes con una segmentación que muestre su valor y sus patrones comerciales.',
    },
    offer: 'Dashboard y segmentación de clientes.',
    service: 'Analítica Avanzada',
  },
  {
    area: 'planning',
    areaName: 'Planificación',
    areaInline: 'planificación',
    question: '¿Cómo planificas las ventas y gastos futuros?',
    options: ['Con previsiones que revisamos.', 'Con estimaciones aproximadas.', 'No realizamos previsiones.'],
    problem: {
      none: 'Ausencia de previsiones empresariales.',
      partial: 'Las previsiones se basan en estimaciones aproximadas.',
    },
    solution: {
      none: 'Desarrollar modelos de previsión de ventas, gastos y escenarios de negocio.',
      partial: 'Afinar las estimaciones actuales con modelos de previsión de ventas, gastos y escenarios de negocio.',
    },
    offer: 'Modelos de previsión de ventas y gastos.',
    service: 'Modelización predictiva y análisis de escenarios',
  },
];

export const MAX_POINTS = QUESTIONS.length * POINTS[0];
