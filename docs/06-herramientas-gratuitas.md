# Herramientas gratuitas · Calculadora de Rentabilidad Empresarial

Sección `/herramientas/` («Entiende y mejora tu negocio») con una única herramienta: la Calculadora de Rentabilidad
Empresarial (`/herramientas/calculadora-rentabilidad/`), presentada como **Trenchs Financial Lab**. Gratis, sin
registro y en una sola pantalla: cuatro datos a la izquierda y un panel tipo dashboard a la derecha que se actualiza
al escribir.

## Decisiones

| Decisión | Motivo |
|---|---|
| Versión simplificada (cuatro datos, una pantalla) | Petición del propietario: mucha menos información. La versión anterior en cinco pasos, con pop-up y formulario de contacto, está en el commit `414b160` por si se quiere recuperar. |
| Sin envío de datos | La herramienta no envía nada: el resumen se copia al portapapeles. La acción comercial es el botón «Solicitar diagnóstico» de toda la web (correo). |
| Cálculo en el navegador, en céntimos enteros | Sumas exactas; solo los cocientes usan decimales y se redondean a céntimos. |
| Estado solo en memoria | Sin `localStorage`, sin URL y sin analítica. |
| Sin dependencias nuevas | Barras en HTML/CSS y animación con Framer Motion, ya presente. |
| Textos en «tú» | Como en el encargo; el resto de la web habla de «usted». Pendiente de decidir si se unifica. |

## Archivos

| Pieza | Archivo |
|---|---|
| Catálogo (ampliable) | `src/content/tools.ts`, `src/components/tools/ToolCard.tsx`, `src/app/herramientas/page.tsx` |
| Página de la calculadora | `src/app/herramientas/calculadora-rentabilidad/page.tsx` |
| Datos y estado | `src/components/calculator/Calculator.tsx`, `fields.tsx` |
| Panel (tabla, distribución, escenario, resumen) | `src/components/calculator/ProfitDashboard.tsx` |
| Motor de cálculo | `src/lib/profitability/engine.ts` |
| Escenarios | `src/lib/profitability/scenarios.ts` |
| Diagnóstico | `src/lib/profitability/diagnosis.ts` |
| Filas de la tabla y resumen copiable | `src/lib/profitability/summary.ts` |
| Importes (lectura y formato) | `src/lib/profitability/money.ts` |
| Pruebas | `src/lib/profitability/profitability.test.ts` |

Para añadir otra herramienta: una entrada en `TOOLS` y su página en `src/app/herramientas/<slug>/page.tsx`.

## Fórmulas

V = facturación · CV = costes variables · GF = gastos fijos · CP = personal · CF = GF + CP

| Indicador | Fórmula | Si no es calculable |
|---|---|---|
| Costes totales | CV + CF | — |
| Resultado mensual estimado | R = V − CV − CF | — (los negativos se muestran en rojo) |
| Margen de contribución | (V − CV) / V | V = 0 → «No disponible» |
| Punto de equilibrio | CF / margen de contribución | V = 0 → «No disponible»; margen ≤ 0 → «No alcanzable» |
| Margen de seguridad | V − punto de equilibrio | sin punto de equilibrio → «No disponible» |

Ejemplo de referencia (botón «Ver un ejemplo»): 25.000 / 8.500 / 4.500 / 7.000 → costes 20.000 €, resultado
5.000 €, margen 66 %, punto de equilibrio 17.424 €, margen de seguridad 7.576 €.

**Escenario** (precios constantes): ventas × (1 + Δventas); costes variables × (1 + Δventas) × (1 + Δcoste
unitario); gastos fijos y personal × (1 + Δfijos). Rangos: ventas −50 % a +100 %, coste unitario −30 % a +30 %,
fijos y personal −30 % a +50 %. La columna «Escenario» solo aparece cuando hay alguna variación.

**Diagnóstico:** sin facturación o sin costes → datos insuficientes; R < 0 → pérdidas; R = 0 → en equilibrio;
margen de resultado < 10 % → margen reducido (criterio orientativo de la herramienta, no sectorial); resto → rentable.

## Pruebas

- `npm test`: 16 pruebas (lectura de importes, ejemplo de referencia, casos límite —facturación cero, costes
  variables ≥ facturación, sin costes fijos, todo cero—, decimales, escenarios, diagnóstico y resumen).
- `npm run typecheck`, `npm run build`, `npm run verify`.
- Revisión en Chrome (escritorio y 390 px): cálculo en vivo, error en dato inválido, pérdidas, escenario, sin
  desbordamiento horizontal.
