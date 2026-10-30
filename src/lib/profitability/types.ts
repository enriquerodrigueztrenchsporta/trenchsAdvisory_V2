import type { Cents } from './money.ts';

export const SECTORS = [
  'Restauración',
  'Comercio',
  'Hostelería y turismo',
  'Servicios profesionales',
  'Construcción',
  'Industria',
  'Tecnología',
  'Otros',
] as const;
export type Sector = (typeof SECTORS)[number];

export type Period = { kind: 'average' } | { kind: 'month'; month: number; year: number };

/** Paso 1. El nombre es opcional y no interviene en ningún cálculo. */
export type CompanyInfo = {
  sector: Sector;
  employees: number;
  period: Period;
  name: string;
};

/** Paso 2. Importes mensuales en céntimos, sin IVA. Los campos opcionales vacíos valen 0. */
export type FinancialInputs = {
  revenue: Cents;
  // Costes variables
  purchases: Cents;
  salesCosts: Cents;
  otherVariable: Cents;
  // Gastos fijos distintos del personal
  rent: Cents;
  utilities: Cents;
  software: Cents;
  insurance: Cents;
  marketing: Cents;
  otherFixed: Cents;
  // Personal (fijo en esta versión)
  salaries: Cents;
  socialSecurity: Cents;
  otherStaff: Cents;
  /** true si «salarios» ya incluye la Seguridad Social a cargo de la empresa: socialSecurity no se suma. */
  salariesIncludeSocialSecurity: boolean;
};

export const FINANCIAL_KEYS = [
  'revenue',
  'purchases',
  'salesCosts',
  'otherVariable',
  'rent',
  'utilities',
  'software',
  'insurance',
  'marketing',
  'otherFixed',
  'salaries',
  'socialSecurity',
  'otherStaff',
] as const;
export type FinancialKey = (typeof FINANCIAL_KEYS)[number];

/** Análisis completo que, con autorización, puede compartirse. */
export type Analysis = { company: CompanyInfo; inputs: FinancialInputs };
