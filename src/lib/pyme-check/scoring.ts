// Motor de PYME Check: puntuación, clasificación y oportunidades. Funciones puras, sin APIs ni IA.
//
// Puntuación = puntos obtenidos / 50 × 100. Oportunidades: áreas con menos de 10 puntos, de menor a mayor
// puntuación y, a igualdad, en el orden de las preguntas; como máximo tres.

import { MAX_POINTS, POINTS, QUESTIONS, type Points, type Question } from './questions.ts';

/** Índice de la opción elegida en cada pregunta (0 = A, 1 = B, 2 = C), o null si aún no se ha respondido. */
export type Answers = (0 | 1 | 2 | null)[];

export const emptyAnswers = (): Answers => QUESTIONS.map(() => null);
export const isComplete = (a: Answers): a is (0 | 1 | 2)[] => a.length === QUESTIONS.length && a.every((x) => x !== null);

export type Level = 'good' | 'opportunities' | 'several';
export const LEVELS: Record<Level, string> = {
  good: 'Tu empresa parece tener una buena base de gestión.',
  opportunities: 'Hay oportunidades para mejorar la gestión de tu negocio.',
  several: 'Tu empresa podría beneficiarse de mejorar varios procesos.',
};

export type AreaResult = Question & { points: Points; answer: 0 | 1 | 2 };
export type Opportunity = Omit<AreaResult, 'problem' | 'solution'> & { problem: string; solution: string };

export type Result = {
  points: number;
  score: number;
  level: Level;
  classification: string;
  areas: AreaResult[];
  /** Hasta tres; vacío si todas las respuestas tienen la puntuación máxima. */
  opportunities: Opportunity[];
};

export const levelOf = (score: number): Level => (score >= 80 ? 'good' : score >= 50 ? 'opportunities' : 'several');

export function evaluate(answers: Answers): Result {
  if (!isComplete(answers)) throw new Error('Faltan respuestas');
  const areas: AreaResult[] = QUESTIONS.map((q, i) => ({ ...q, answer: answers[i], points: POINTS[answers[i]] }));
  const points = areas.reduce((s, a) => s + a.points, 0);
  const score = Math.round((points / MAX_POINTS) * 100);
  const level = levelOf(score);
  // sort es estable: a igual puntuación se conserva el orden de las preguntas.
  const opportunities = areas
    .filter((a) => a.points < POINTS[0])
    .sort((a, b) => a.points - b.points)
    .slice(0, 3)
    .map((a) => {
      const kind = a.points === 0 ? 'none' : 'partial';
      return { ...a, problem: a.problem[kind], solution: a.solution[kind] };
    });
  return { points, score, level, classification: LEVELS[level], areas, opportunities };
}

/** «a», «a y b», «a, b y c». */
export const joinEs = (items: string[]) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`);

/** Frase del pop-up según el resultado. */
export function pitchText(r: Result): string {
  if (!r.opportunities.length) {
    return 'Según tus respuestas, tu empresa tiene una buena base en las cinco áreas. Podemos ayudarte a revisarla periódicamente y a seguir mejorándola.';
  }
  return `Según tus respuestas, hemos identificado oportunidades de mejora en ${joinEs(r.opportunities.map((o) => o.areaInline))}.`;
}
