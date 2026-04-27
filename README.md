# Stepper + Status Card

## Onboarding para evaluación del challenge

Esta sección está pensada para **quien debe revisar la entrega**: permite comprobar el cumplimiento del enunciado y ubicar el código relevante sin leer el documento entero de punta a punta.

### Verificación rápida (sin dispositivo)

1. **Prerrequisitos:** Node.js ≥ 22.11 y pnpm (detalle en [Setup y prerrequisitos](#setup-y-prerrequisitos)).
2. Instalación: `pnpm install`.
3. Calidad estática: `pnpm check` (Biome: lint + formato; no escribe archivos).
4. Tests: `pnpm test` (Jest; la suite debe finalizar sin fallos).

Si estos tres comandos están en verde, la base del challenge (tipos, reducer, i18n, integración del flujo) está automatizada en CI local.

### Verificación en emulador o dispositivo

1. Entorno React Native según la [documentación oficial](https://reactnative.dev/docs/environment-setup) (Android: JDK + SDK; iOS en macOS: Xcode + CocoaPods).
2. Primera vez en iOS: `cd ios && pod install && cd ..`.
3. Metro: `pnpm start`.
4. Run: `pnpm android` o `pnpm ios`.

**Recorrido mínimo para validar UX:** paso 1 (intro) → paso 2 (carrusel de cards del mock, indicadores tipo _pagination dots_, selección) → paso 3 (`StatusCard` + acciones que cambian el estado respetando transiciones permitidas). Volver atrás y comprobar que la tarjeta elegida se mantiene.

### Enunciado → implementación (trazabilidad)

| Requisito del challenge                                        | Dónde está en el repo                                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Flujo stepper, **más de 2 pasos**                              | `src/features/stepperFlow/types.ts` (`STEPPER_MAX_STEP`), `StepRenderer.tsx`, `NavigationControls.tsx` |
| **Context** que gobierna el render del stepper                 | `src/features/stepperFlow/context/StepperContext.tsx`, `src/features/stepperFlow/hooks/useStepper.ts`  |
| **Card** en el paso final con **estilos distintos por estado** | `src/features/stepperFlow/components/StatusCard.tsx`, `src/components/ui/Badge.tsx`                    |
| **Lógica** para cambiar estados de la card y **navegar** pasos | Reducer (`UPDATE_CARD_STATUS`, transiciones) + `CardStatusActions.tsx` + controles de navegación       |
| **Mock JSON** como fuente de datos                             | `src/services/mockData.json` (servido por `src/services/api/cardsApi.ts` vía `axios-mock-adapter`)     |
| **i18n**                                                       | `src/app/i18n/` (`resources/es.json`, `en.json`, contract test en `__tests__/resources.test.ts`)       |
| **Stylesheet**                                                 | `StyleSheet.create` en pantallas/componentes; tokens en `src/components/ui/theme.ts`                   |

### Orden sugerido de lectura del código

1. `src/features/stepperFlow/types.ts` — modelo de estado, acciones y matriz `CARD_STATUS_TRANSITIONS`.
2. `src/features/stepperFlow/context/StepperContext.tsx` — `useReducer` y comportamiento por acción.
3. `src/app/AppRoot.tsx` — composición del flujo, carrusel del paso 2 y wiring con el contexto.
4. `src/features/stepperFlow/components/StepRenderer.tsx` — qué se renderiza en cada paso.
5. Tests representativos: `src/features/stepperFlow/__tests__/stepperReducer.test.ts` y `src/app/__tests__/AppRoot.test.tsx`.

### Qué mirar si el tiempo es muy acotado

- Un solo archivo de negocio: `types.ts` + `StepperContext.tsx` (estado y reglas).
- Un solo archivo de integración: `AppRoot.test.tsx` (navegación, picker, sincronización con el carrusel).
- Un componente de UI del requisito final: `CardStatusActions.tsx` junto a `StatusCard.tsx`.

---

Aplicación móvil en React Native que resuelve el desafío técnico **"Stepper + Card con Estados"**: un flujo informativo de varios pasos que termina en una tarjeta capaz de reflejar y alternar los estados _habilitado_, _deshabilitado_, _pausado_ y _despausado_.

**Autoría:** Max Santana — [maxsantana.dev@gmail.com](mailto:maxsantana.dev@gmail.com).

---

## Tabla de contenidos

- [Onboarding para evaluación del challenge](#onboarding-para-evaluación-del-challenge)
- [Resumen funcional](#resumen-funcional)
- [Stack y dependencias](#stack-y-dependencias)
- [Decisiones de arquitectura](#decisiones-de-arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Flujo de la aplicación](#flujo-de-la-aplicación)
- [Máquina de estados de la card](#máquina-de-estados-de-la-card)
- [Internacionalización (i18n)](#internacionalización-i18n)
- [Accesibilidad (a11y)](#accesibilidad-a11y)
- [Setup y prerrequisitos](#setup-y-prerrequisitos)
- [Scripts disponibles](#scripts-disponibles)
- [Estrategia de testing](#estrategia-de-testing)
- [Cómo extender el proyecto](#cómo-extender-el-proyecto)

---

## Resumen funcional

La app guía al usuario por tres pasos:

1. **Introducción** – pantalla informativa con copy traducible.
2. **Detalle** – carrusel horizontal con las tarjetas del mock; cada una expone su estado actual.
3. **Estado de la tarjeta** – `StatusCard` final con la información de la tarjeta seleccionada y un toolbar de acciones (`Habilitar`, `Pausar`, `Despausar`, `Deshabilitar`) que respeta la matriz de transiciones permitidas.

El stepper expone navegación adelante/atrás, deshabilita "Continuar" si no hay tarjeta seleccionada en el paso 2, y reemplaza el botón por "Finalizar" en el paso 3.

## Stack y dependencias

| Capa                 | Elección                                                               | Por qué                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime móvil        | **React Native 0.85** + **React 19**                                   | Última generación estable; el código adopta los patrones nuevos de React 19 (`use()`, `<Context value=...>`).                                  |
| Lenguaje             | **TypeScript 5.8 estricto**                                            | Sin `any` en el código de producción; _discriminated unions_ para los estados de la card.                                                      |
| Manejo de estado     | **React Context + `useReducer`**                                       | El desafío lo pide explícitamente. Suficiente para un flujo aislado; evita traer una librería extra.                                           |
| Internacionalización | **`i18next` + `react-i18next`**                                        | Estándar de la industria; permite _namespaces_ por dominio y _interpolación_.                                                                  |
| Estilos              | **`StyleSheet.create` + design tokens** (`src/components/ui/theme.ts`) | El desafío pide _Stylesheet_; los tokens centralizados habilitan futuras migraciones a un theme provider o a NativeWind sin tocar componentes. |
| Linter / Formatter   | **Biome JS** (en lugar de ESLint+Prettier)                             | Una sola herramienta, rápida, con configuración mínima.                                                                                        |
| Testing              | **Jest** + **react-test-renderer** + preset de RN                      | TDD del reducer y tests de integración del flujo completo.                                                                                     |
| Package manager      | **pnpm** (Node ≥ 22.11)                                                | Velocidad y `node-linker=hoisted` para compatibilidad RN.                                                                                      |

## Decisiones de arquitectura

### Feature-Sliced Design (FSD)

`src/` se divide por capas de responsabilidad en lugar de por tipo técnico:

- **`src/app/`** – bootstrapping global: providers, i18n, `AppRoot`.
- **`src/components/ui/`** – átomos reutilizables (`Button`, `Badge`, `Typography`) más los design tokens.
- **`src/features/<feature>/`** – dominios de negocio cerrados; cada uno tiene su `context/`, `hooks/`, `components/` y `__tests__/`.
- **`src/services/`** – fuentes de datos (en este caso `mockData.json`).
- **`src/services/`** – capa de datos: cliente HTTP (`axiosClient`), API (`cardsApi`), DTOs + mappers y mock con `axios-mock-adapter`.

Esto deja claro qué se puede romper sin afectar a otras features y facilita mover `stepperFlow` a un paquete independiente más adelante.

### Context con `useReducer`, sin prop-drilling

`StepperContext` expone un único `value = { state, dispatch }` y un hook `useStepper()` que envuelve los `dispatch` en _callbacks memoizados_ (`next`, `back`, `selectCard`, `updateCardStatus`, `setLoading`, `setError`). Los componentes nunca importan `dispatch` directamente, lo que permite refactorear la implementación interna del store sin tocar la UI.

### React 19 puro

- `<Context value={...}>` sin `Context.Provider`.
- `use(StepperContext)` en lugar de `useContext`.
- `ref` se declara como prop normal en `Button`, sin `forwardRef`.

### Lógica de transiciones centralizada

`CARD_STATUS_TRANSITIONS` y `isValidCardStatusTransition` viven en `src/features/stepperFlow/types.ts`. Son la única fuente de verdad; los consume:

- el reducer (rechaza transiciones inválidas),
- la UI (`CardStatusActions` deshabilita los botones que no aplican),
- los tests (validan la matriz completa).

Cualquier cambio de regla de negocio se hace en un solo archivo.

### Render dinámico del stepper

`StepRenderer` lee `currentStep` del context y elige qué panel mostrar (intro / detalle / status). Esto cumple el requisito _"Context para manejar el render del stepper"_ sin acoplar los componentes hijos al estado del stepper.

## Estructura del proyecto

```
src/
├── app/
│   ├── AppProviders.tsx        # SafeAreaProvider y futuros providers globales
│   ├── AppRoot.tsx             # Composición del flujo completo
│   ├── i18n/
│   │   ├── index.ts            # Init de i18next + export de resources
│   │   └── resources/{es,en}.json
│   └── __tests__/AppRoot.test.tsx
├── components/ui/
│   ├── Badge.tsx               # Pill con paleta por estado de card
│   ├── Button.tsx              # Variantes primary | outline | ghost
│   ├── Typography.tsx          # Heading | Subtitle | Body
│   ├── theme.ts                # colors / spacing / radii / typography / elevation
│   └── __tests__/...
├── features/stepperFlow/
│   ├── components/
│   │   ├── CardStatusActions.tsx   # Toolbar para alternar estados
│   │   ├── NavigationControls.tsx  # Botones Volver / Continuar / Finalizar
│   │   ├── StatusCard.tsx          # Card final
│   │   ├── StepIndicator.tsx       # Barra de progreso accesible
│   │   ├── StepRenderer.tsx        # Render dinámico por step
│   │   └── __tests__/...
│   ├── context/StepperContext.tsx  # createContext + reducer + Provider
│   ├── hooks/useStepper.ts         # Hook de consumo
│   ├── types.ts                    # State, Action, transiciones, constantes
│   └── __tests__/stepperReducer.test.ts
└── services/
    ├── api/
    │   └── cardsApi.ts             # GET /v1/cards (mockeado con axios-mock-adapter)
    ├── http/
    │   └── axiosClient.ts          # axios.create + interceptor de errores (AppHttpError)
    ├── mappers/
    │   └── mapCardsDto.ts          # unknown -> FinancialCard[]
    ├── types/
    │   └── cards.dto.ts            # contrato DTO del mock (CardsResponseDto)
    ├── config.ts                   # baseURL, timeout, flag de simulación de error
    ├── mockData.json               # 4 tarjetas, una por estado
    └── __tests__/...
```

## Flujo de la aplicación

```
┌────────────┐  next   ┌────────────┐  next   ┌──────────────────┐
│  Step 1    │────────▶│  Step 2    │────────▶│  Step 3          │
│  Intro     │◀────────│  Detalle   │◀────────│  Status + Acción │
└────────────┘  back   └────────────┘  back   └──────────────────┘
       ▲                    │                          │
       │                    │ select card              │ updateCardStatus
       │                    ▼                          ▼
       │            ┌────────────────┐         ┌──────────────────┐
       └────────────│ StepperContext │◀────────│  Reducer guarda  │
                    │   (useReducer) │         │  transición      │
                    └────────────────┘         └──────────────────┘
```

### Flujo HTTP (demo sin backend real)

No existe un backend real en este demo. Para simular un backend sin cambiar el código de UI:

- `src/services/http/axiosClient.ts` crea un `axiosClient` con:
  - `baseURL` (`API_BASE_URL`) y `timeout` (`API_TIMEOUT_MS`) desde `src/services/config.ts`.
  - un interceptor de `response` que normaliza errores a `AppHttpError` (`{ message, status? }`).
- `src/services/api/cardsApi.ts` registra un `axios-mock-adapter` **a nivel de módulo** que intercepta `GET /v1/cards` y responde con:
  - `200` + `mockData.json`, o
  - `networkError()` si `SIMULATE_CARDS_FETCH_FAILURE` está en `true`.
- `src/services/mappers/mapCardsDto.ts` convierte `unknown` en `FinancialCard[]` de forma defensiva (si falta `cards`, devuelve `[]`).

La UI consume esto mediante el hook `src/features/stepperFlow/hooks/useCards.ts`.

## Máquina de estados de la card

| Estado actual | Transiciones permitidas |
| ------------- | ----------------------- |
| `enabled`     | `paused`, `disabled`    |
| `disabled`    | `enabled`               |
| `paused`      | `unpaused`, `disabled`  |
| `unpaused`    | `paused`, `disabled`    |

`UPDATE_CARD_STATUS` es **idempotente** ante una transición inválida: el reducer devuelve la misma referencia de estado y la UI deshabilita el botón correspondiente con un `accessibilityHint` explicativo, así que el usuario nunca puede llegar a un estado prohibido.

## Internacionalización (i18n)

- Español (`es`) es el idioma por defecto y _fallback_.
- Las claves están agrupadas por dominio: `common.*`, `home.*`, `stepper.*`, `card.*`, `a11y.*`.
- Todo texto visible y todo `accessibilityLabel` / `accessibilityHint` pasa por `t('namespace.key')`. No hay strings _hardcodeadas_ en la UI.
- Existe un _contract test_ (`src/app/i18n/__tests__/resources.test.ts`) que falla la build si las claves de `es.json` y `en.json` divergen.

Para agregar una nueva clave alcanza con sumarla en ambos archivos manteniendo la misma ruta.

## Manejo de errores (UX)

- El hook `useCards` carga tarjetas al montar:
  - si falla la request, setea `error` con un mensaje traducido (`errors.cardsLoadFailed` o `errors.network`) y muestra un toast vía `showErrorToast`.
  - expone `refetch()` para reintentar manualmente.
- En el paso 2 (`StepperFlowScreen`), si termina la carga y no hay tarjetas (`cards.length === 0`), se muestra un estado vacío con:
  - el mensaje de `error` (si existe) o un fallback traducido,
  - botón **Reintentar** que llama a `refetch()`.

## Accesibilidad (a11y)

Cada elemento interactivo cumple los cuatro mínimos definidos en `.cursorrules`:

- `accessible={true}`
- `accessibilityRole` apropiado (`button`, `progressbar`, `toolbar`, `summary`, `radiogroup`).
- `accessibilityLabel` proveniente de i18n.
- `accessibilityHint` cuando la acción no es obvia (especialmente para botones deshabilitados).

Casos destacados:

- `StepRenderer` se anuncia como `accessibilityLiveRegion="polite"` para que lectores de pantalla informen los cambios de paso.
- `StepIndicator` usa `accessibilityRole="progressbar"` con `accessibilityValue={{ min, max, now }}`.
- Los botones del toolbar `CardStatusActions` exponen un _hint_ distinto cuando la transición no está permitida.

## Estrategia de testing

- **TDD del reducer** – `stepperReducer.test.ts` cubre cada `action`, los límites del paso, las transiciones válidas e inválidas y los _no-ops_ (sin tarjeta seleccionada, transición prohibida).
- **Tests de componentes** – `StatusCard`, `StepIndicator`, `NavigationControls`, `CardStatusActions`, `StepRenderer`, etc., validan i18n, a11y y los estados visuales.
- **Tests de integración** – `AppRoot.test.tsx` ejerce el flujo completo: navegación, selección de tarjeta vía botón y vía `onViewableItemsChanged`, persistencia entre pasos.
- **Mock de `FlatList`** – `jest.setup.ts` reemplaza la `FlatList` virtualizada por un wrapper que renderiza todos los items, para que los tests no dependan del _windowing_ y permanezcan deterministas.
- **Contrato i18n** – test que falla si las claves de ES y EN divergen.

Cobertura actual: 13 suites, 97 tests, 0 fallos.

## Cómo extender el proyecto

### Agregar un estado nuevo a la card

1. Sumarlo a `CardStatusKind` y al _discriminated union_ `CardStatus` en `src/features/stepperFlow/types.ts`.
2. Definir las transiciones en `CARD_STATUS_TRANSITIONS`.
3. Agregar paleta en `Badge.tsx` (`STATUS_PALETTE`) y acento en `StatusCard.tsx` (`ACCENT_BY_STATUS`).
4. Agregar copy en `card.statuses.*`, `card.actions.*` y `a11y.card.actionHint.*` en ambos JSON.
5. Cubrir las nuevas transiciones en `stepperReducer.test.ts`.

### Agregar una tarjeta al mock

Editá `src/services/mockData.json`. El test `mockData.test.ts` valida tipos y estados, así que cualquier inconsistencia rompe el build.

### Agregar un nuevo paso al stepper

1. Subir `STEPPER_MAX_STEP` en `types.ts`.
2. Agregar la rama correspondiente en `StepRenderer.tsx`.
3. Sumar la traducción en `stepper.steps.*`.
4. Si el paso requiere validación previa, extender `NavigationControls` para deshabilitar "Continuar".

### Agregar un idioma

1. Crear `src/app/i18n/resources/<lang>.json` clonando la estructura de `es.json`.
2. Registrarlo en `src/app/i18n/index.ts` dentro de `resources`.
3. Verificar que el contract test sigue verde.
