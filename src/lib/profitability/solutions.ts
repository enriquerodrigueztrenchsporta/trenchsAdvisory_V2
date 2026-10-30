// Motor de soluciones: relaciona cada diagnóstico con servicios de Trenchs Advisory mediante una tabla de reglas.
// Para ampliarlo basta con añadir o editar entradas; las soluciones son propuestas preliminares sujetas a revisión.

import type { DiagnosisKind } from './diagnosis.ts';

export type Proposal = {
  /** Problema u oportunidad que motiva la propuesta. */
  problem: string;
  solutions: string[];
  service: string;
  /** Área de servicio relacionada (slug de /servicios/...). */
  area: 'consultoria-financiera' | 'inteligencia-de-negocio';
  pitch: { title: string; text: string; cta: string };
};

const RECOVERY: Proposal = {
  problem: 'Los costes introducidos superan los ingresos.',
  solutions: [
    'Análisis de estructura de costes.',
    'Identificación de gastos prioritarios.',
    'Análisis de márgenes.',
    'Simulación de escenarios de recuperación.',
    'Creación de dashboard financiero para seguimiento.',
  ],
  service: 'Consultoría de rentabilidad y optimización de costes',
  area: 'consultoria-financiera',
  pitch: {
    title: 'Tu empresa tiene oportunidades para recuperar rentabilidad.',
    text: 'En Trenchs Advisory podemos ayudarte a analizar qué factores afectan a tus resultados y desarrollar un plan de mejora.',
    cta: 'Quiero mejorar mi rentabilidad',
  },
};

const MARGINS: Proposal = {
  problem: 'Rentabilidad positiva, pero limitada según el criterio orientativo de esta herramienta.',
  solutions: [
    'Análisis financiero detallado.',
    'Revisión de costes fijos y variables.',
    'Estudio de oportunidades de ahorro.',
    'Simulación de escenarios.',
    'Implantación de indicadores financieros.',
  ],
  service: 'Análisis financiero y mejora de márgenes',
  area: 'consultoria-financiera',
  pitch: {
    title: 'Descubre cómo podrías mejorar tus márgenes.',
    text: 'Podemos ayudarte a estudiar tus costes, identificar oportunidades de mejora y desarrollar herramientas para controlar tu rentabilidad.',
    cta: 'Quiero optimizar mis márgenes',
  },
};

export const PROPOSALS: Record<DiagnosisKind, Proposal> = {
  losses: RECOVERY,
  breakeven: { ...MARGINS, problem: 'Los ingresos cubren exactamente los costes: no hay margen ante cualquier desviación.' },
  'low-margin': MARGINS,
  profitable: {
    problem: 'Oportunidad: mejorar el control y el seguimiento financiero.',
    solutions: [
      'Desarrollo de dashboards personalizados.',
      'Automatización de reporting financiero.',
      'Seguimiento mensual de indicadores.',
      'Sistemas de alertas.',
      'Previsiones y simulaciones financieras.',
    ],
    service: 'Business Intelligence y automatización financiera',
    area: 'inteligencia-de-negocio',
    pitch: {
      title: 'Convierte tus datos en mejores decisiones.',
      text: 'Podemos desarrollar dashboards financieros y sistemas de automatización para ayudarte a controlar y anticipar los resultados de tu negocio.',
      cta: 'Quiero controlar mejor mi empresa',
    },
  },
  insufficient: {
    problem: 'No hay datos suficientes para un diagnóstico fiable.',
    solutions: ['Estructuración de la información económica disponible.', 'Análisis de los datos para identificar oportunidades de mejora.'],
    service: 'Diagnóstico financiero personalizado',
    area: 'consultoria-financiera',
    pitch: {
      title: 'Conoce mejor la situación financiera de tu negocio.',
      text: 'Podemos ayudarte a estructurar y analizar tus datos para identificar oportunidades de mejora.',
      cta: 'Solicitar asesoramiento',
    },
  },
};

export const proposalFor = (kind: DiagnosisKind): Proposal => PROPOSALS[kind];
