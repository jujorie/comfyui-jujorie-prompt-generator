# ComfyUI Jujorie Prompt Generator 🎬

Un servidor web que genera prompts aleatorios optimizados para el modelo **z-image turbo** (Stable Diffusion) en ComfyUI para fotografía profesional de modelos.

## Descripción

Esta aplicación es un generador inteligente de prompts específicamente diseñado para el modelo de difusión **z-image turbo**, que es una versión optimizada y rápida de Stable Diffusion. La herramienta combina múltiples elementos visuales (poses, iluminación, composición, etc.) para crear descripciones únicas y coherentes que generan imágenes de alta calidad en ComfyUI.

### Contexto Técnico

- **Modelo**: z-image turbo (Stable Diffusion optimizado)
- **Plataforma**: ComfyUI (Node-based UI para Stable Diffusion)
- **Tipo**: Modelo de difusión latente para generación de imágenes
- **Propósito**: Generar prompts especializados para fotografía profesional y modelos femeninos

El proyecto toma en cuenta las características específicas del modelo z-image turbo al diseñar los datasets y builders, asegurando que los prompts generados sean óptimos para este modelo particular.

## Requisitos

- Node.js 18+
- npm

## Notas sobre z-image turbo y Stable Diffusion

El modelo z-image turbo es una versión optimizada de Stable Diffusion que genera imágenes más rápidamente. **Es crucial entender que este modelo prefiere y entiende mucho mejor el LENGUAJE FOTOGRÁFICO** que descriptores genéricos.

### Lenguaje Fotográfico Recomendado para z-image turbo

z-image turbo responde significativamente mejor a términos técnicos de fotografía profesional:

**✅ EXCELENTES (Lenguaje Fotográfico Profesional):**
- **Iluminación**: "rembrandt lighting", "three-point lighting", "chiaroscuro", "rim lighting", "fill light", "key light"
- **Composición**: "rule of thirds", "golden ratio", "leading lines", "negative space", "depth layering", "foreground-background separation"
- **Técnica de cámara**: "eye-level perspective", "dutch angle", "over-the-shoulder shot", "bird's eye view", "depth of field"
- **Proporciones corporales**: "waist-to-hip ratio", "shoulder frame", "V-shaped torso", "hourglass ratio structure"
- **Poses**: "contrapposto stance", "asymmetrical weight distribution", "three-point stance"
- **Acabados**: "cinematic color grading", "editorial photography", "museum quality finish", "professional color correction"
- **Calidad**: "4k resolution", "hyperrealistic", "anatomically precise", "flawless skin rendering"

**❌ EVITAR (Descriptores Genéricos):**
- Frases vagas como "bonita", "hermosa", "attractive"
- Lenguaje no fotográfico o demasiado técnico de anatomía
- Descripciones redundantes o contradictorias

### Principios de Optimización para z-image turbo

Al ajustar los datos y prompts de este generador, considera:

1. **Especificidad Fotográfica**: Los detalles técnicos (ángulos, iluminación, composición) se traducen mucho mejor que descripciones generales
2. **Coherencia Visual**: Combina términos que trabajen juntos (ej: "rim lighting" + "dramatic shadows" + "moody atmospheric")
3. **Vocabulario Stable Diffusion**: Usa términos que el modelo ha visto durante entrenamiento
4. **Profesionalismo**: El modelo genera mejor con referencia a estándares profesionales (editorial, cinematic, studio)
5. **Descriptores Técnicos**: Incluir términos como "photorealistic", "4k", "ultra-detailed" mejora calidad

Cuando agregues nuevos datos a los JSON, asegúrate de que sean:
- Descriptivos con lenguaje fotográfico profesional
- Compatibles con el vocabulario de Stable Diffusion
- Óptimos para fotografía profesional de modelos
- Específicos en términos técnicos, no genéricos

## Instalación

```bash
npm install
```

## Uso

### Iniciar el servidor

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3005`

## Endpoints

### GET `/prompt`

Genera un prompt aleatorio para fotografía de modelos.

**Parámetros de Query:**
- `style` (opcional): Estilo específico del preset (sin preset default es aleatorio)
  - Presets disponibles: `cinematic`, `editorial`, `noir`, `minimal`, `luxury`, `glamour`, `natural`, `artistic`, `beauty`, `moody`, `studio`, `commercial`
- `lighting` (opcional): Iluminación específica que override el dataset aleatorio (ej: "natural", "butterfly", "rembrandt")
- `mode` (opcional): Modo de generación (default: "cinematic")
  - `zero`: Intro simple "A professional photo of a woman." + 1 item quality + 1 item finish
  - `cinematic`: Intro normal + 2 items quality + 2 items finishes (default)
  - `detailed`: Intro normal + 3 items quality + 2 items finishes
  - `spicy`: Intro audaz + 1 item quality + 2 items finishes + lighting forzado
- `format` (opcional): Formato de salida - "json" o "text" (default: "json")
  - `json`: Devuelve objeto con prompt, mode y config
  - `text`: Devuelve solo el texto del prompt en texto plano

**Respuesta (format=json):**
```json
{
  "prompt": "A professional photo of a woman...",
  "mode": "cinematic",
  "config": {
    "summary": "...",
    "model": "She has...",
    "location": "...",
    "pose": "...",
    "camera": "...",
    "lighting": "...",
    "finishes": "..."
  }
}
```

**Respuesta (format=text):**
```
A professional photo of a woman.

She has blue eyes.
She has blonde hair.
She has a athletic build, hourglass figure, long-legged proportions, elegant posture.
She has fair skin.

minimalist studio environment.

confident relaxed pose.

full-body shot, eye-level perspective, centered composition.

soft diffused lighting.

photorealistic, editorial photography, cinematic color grading.
```

**Ejemplos:**
```
GET /prompt
GET /prompt?mode=spicy
GET /prompt?mode=zero&format=text
GET /prompt?lighting=natural&format=json
```

### GET `/prompt/closeup`

Genera un prompt de fotografía de close-ups (primeros planos) - cara o cara y hombros SOLO.

Similar a `/prompt` pero garantiza que siempre genera planos cercanos:
- `extreme close-up facial`
- `head and shoulders portrait`
- `chest-up portrait`
- `beauty closeup detail`
- `detail shot of features`
- `intimate portrait shot`
- `bust portrait`

**Parámetros de Query:**
Soporta los mismos parámetros que `/prompt`:
- `style`: Preset específico
- `lighting`: Iluminación específica
- `mode`: Modo de generación (zero, cinematic, detailed, spicy)
- `format`: json o text

**Respuesta:** Idéntica a `/prompt` pero con shots garantizados como close-up.

**Ejemplos:**
```
GET /prompt/closeup
GET /prompt/closeup?mode=spicy&style=beauty
GET /prompt/closeup?format=text&lighting=butterfly
GET /prompt/closeup?mode=detailed
```

## 🎯 Filtrado Dinámico

Además de los parámetros estándar (`style`, `lighting`, `mode`, `format`), ambos endpoints `/prompt` y `/prompt/closeup` soportan **filtrado dinámico** para cualquier elemento del dataset.

### Cómo Funciona

Puede pasar cualquier parámetro que corresponda a un dataset para filtrar los resultados por palabras clave (búsqueda **OR** case-insensitive):

**Parámetro de filtro → Dataset:**
- `eyes` → Colores/tipos de ojos
- `hair` → Estilos de cabello
- `skin` → Tonos de piel
- `bodyTypes` → Tipos de cuerpo
- `bodyShapes` → Formas corporales
- `bodyProportions` → Proporciones corporales
- `bodyDetails` → Detalles corporales
- `shots` → Tipos de plano
- `angles` → Ángulos de cámara
- `compositions` → Composiciones visuales
- `locations` → Locaciones
- `poses` → Poses
- `quality` → Niveles de calidad
- `finishes` → Acabados fotográficos
- `lighting` → Tipos de iluminación
- `summary` → Textos introductorios

### Ejemplos de Filtrado

**Filtro simple (una palabra clave):**
```
GET /prompt?eyes=blue
```
→ Busca en todos los ojos que contengan "blue" (búsqueda case-insensitive)
→ Resultado: "icy blue eyes", "deep blue eyes with intensity", etc.

**Múltiples valores (búsqueda OR):**
```
GET /prompt?skin=pale&skin=porcelain
```
→ Busca elementos que contengan "pale" **O** "porcelain"
→ Resultado: "very pale porcelain skin" O "pale skin with cool undertones"

**Múltiples datasets:**
```
GET /prompt?eyes=deep&eyes=blue&hair=blonde&shots=full
```
→ Filtra ojos (deep O blue), cabello (blonde), y planos (full)
→ Combina filtros de diferentes datasets

**Con otros parámetros:**
```
GET /prompt?eyes=green&mode=spicy&style=natural&format=text
```
→ Filtra ojos por "green" y aplica los parámetros estándar

**Filtro vacío (sin coincidencias):**
```
GET /prompt?eyes=nonexistent
```
→ Si no hay coincidencias, ese campo queda vacío en la plantilla
→ Los demás elementos se generan normalmente

### Comportamiento

- 🔍 **Búsqueda case-insensitive**: "BLUE" = "blue" = "Blue"
- 🔄 **Múltiples valores del mismo param**: Se combinan con lógica OR
- 🎲 **Sin coincidencias**: Devuelve string vacío (la plantilla lo omite)
- 📝 **Compatible**: Los filtros funcionan con todos los parámetros estándar (`mode`, `style`, `lighting`, `format`)
- ⚡ **Rendimiento**: Los filtros aplican búsqueda string (no regex) para máxima velocidad

### Casos de Uso

1. **Generar prompts con ojos específicos:**
   ```
   GET /prompt?eyes=green&eyes=emerald
   ```

2. **Forzar tonos de piel claros:**
   ```
   GET /prompt?skin=pale&skin=fair&skin=light
   ```

3. **Planos cerrados de belleza:**
   ```
   GET /prompt/closeup?shots=beauty&shots=detail
   ```

4. **Combinación: Close-up con iluminación específica:**
   ```
   GET /prompt/closeup?eyes=blue&lighting=butterfly&mode=detailed
   ```

5. **Generar serie de prompts con variaciones controladas:**
   ```
   GET /prompt?hair=blonde&format=text
   GET /prompt?hair=brunette&format=text
   GET /prompt?hair=red&format=text
   ```

### GET `/options`

Retorna todos los datasets disponibles con las opciones para cada categoría.

**Respuesta:**
```json
{
  "bodyTypes": [...],
  "shots": [...],
  "lighting": [...],
  "finishes": [...],
  "skinTones": [...],
  "compositions": [...],
  "quality": [...],
  "presets": {...},
  "eyes": [...],
  "hair": [...],
  "locations": [...],
  "poses": [...],
  "angles": [...],
  "modes": {...}
}
```

## Estructura del Proyecto

```
web/
├── src/
│   ├── server.js              # Servidor Express principal
│   ├── template.js            # Plantilla para construcción de prompts
│   ├── closeup-template.js    # Plantilla para prompts de close-up
│   ├── data-loader.js         # Cargador de archivos JSON de datos
│   ├── body-builder.js        # Constructor de descripción de cuerpo
│   ├── camera-builder.js      # Constructor de descripción de cámara
│   ├── closeup-camera-builder.js # Constructor de cámara para close-ups
│   ├── model-builder.js       # Constructor de descripción de modelo
│   ├── finish-builder.js      # Constructor de descripción de finishes
│   ├── summary-builder.js     # Constructor de resumen/intro
│   └── utils/
│       └── random.js          # Funciones de selección aleatoria (includes pickCloseupShot)
├── data/
│   ├── angles.json            # Ángulos de cámara (25 items - perspectiva)
│   ├── body-types.json        # Tipos de cuerpo (24 items - volumen/peso)
│   ├── body-shapes.json       # Formas corporales (25 items - distribución)
│   ├── body-proportions.json  # Proporciones (25 items - proporciones específicas)
│   ├── body-details.json      # Detalles corporales (25 items - textura/definición)
│   ├── compositions.json      # Composiciones visuales (20 items)
│   ├── eyes.json              # Colores y tipos de ojos (32 items)
│   ├── finishes.json          # Acabados de imagen (30 items - estilos fotográficos)
│   ├── hair.json              # Estilos de cabello (30 items)
│   ├── lighting.json          # Tipos de iluminación (20 items - técnicas profesionales)
│   ├── locations.json         # Locaciones (24 items)
│   ├── modes.json             # Configuración de modos (zero, cinematic, detailed, spicy)
│   ├── poses.json             # Poses (20 items - posturas corporales)
│   ├── presets.json           # Estilos predefinidos (12 presets)
│   ├── quality.json           # Calidad de imagen (20 items - resolución/realismo)
│   ├── shots.json             # Tipos de planos (26 items - tamaño de frame)
│   ├── skin-tones.json        # Tonos de piel (24 items)
│   ├── summary.json           # Resúmenes/intros para prompts comunes (20 items)
│   └── summary-spicy.json     # Resúmenes alternativos para modo "spicy" (15 items)
├── package.json               # Dependencias y scripts
└── README.md                  # Este archivo
```

## Modos de Generación

Los modos controlan la cantidad de detalles y tipo de introducción:

| Modo | Intro | Quality items | Finish items | Uso |
|------|-------|-------|--------|-----|
| **zero** | Simple: "A professional photo of a woman." | 1 | 1 | Prompts minimalistas |
| **cinematic** | Normal (20 options) | 2 | 2 | Balance calidad-detalle (DEFAULT) |
| **detailed** | Normal (20 options) | 3 | 2 | Máximo realismo |
| **spicy** | Audaz (15 options + drama) | 1 | 2 | Estilo editorial dramático |

## Presets (Estilos Predefinidos)

Los presets override el lighting aleatorio y fuerzan un estilo visual específico:

- `cinematic`: Iluminación cinematográfica y color grading
- `editorial`: Estilo fotográfico editorial profesional
- `noir`: Aesthetic noir con iluminación baja
- `minimal`: Composición y lighting minimalista
- `luxury`: Styling lujoso con iluminación profesional
- `glamour`: Estilo glamour con lighting halagador
- `natural`: Iluminación natural y estilo candid
- `artistic`: Composición artística y color correction
- `beauty`: Lighting de belleza (butterfly, loop)
- `moody`: Atmospheric y tonos dramáticos
- `studio`: Studio profesional estándar
- `commercial`: Comercial/advertising focused

## Tecnologías

- **Express.js**: Framework web
- **Node.js**: Runtime de JavaScript
- **ES Modules**: Sistema de módulos moderno

## Scripts Disponibles

- `npm start`: Inicia el servidor

## Docker

### Requisitos
- Docker
- Docker Compose (opcional)

### Compilar la imagen

```bash
docker build -t comfyui-prompt-generator .
```

### Ejecutar el contenedor

```bash
docker run -p 3005:3005 comfyui-prompt-generator
```

Con un nombre específico:

```bash
docker run -d --name prompt-generator -p 3005:3005 comfyui-prompt-generator
```

### Con Docker Compose

Ejecuta el servicio con compose:

```bash
docker-compose up -d
```

Detener el servicio:

```bash
docker-compose down
```

Ver logs:

```bash
docker-compose logs -f prompt-generator
```

## Características

✨ Generación de prompts aleatorios coherentes y visuales para z-image turbo
🎨 20+ JSON datasets con 20-32 items cada uno (400K+ combinaciones posibles)
⚙️ 4 modos de generación (zero, cinematic, detailed, spicy)
🔧 12 presets predefinidos para estilos específicos
🎯 Lenguaje fotográfico profesional optimizado para Stable Diffusion
📊 2 endpoints: `/prompt` (general) y `/prompt/closeup` (primeros planos)
🔍 Filtro automático de close-ups con perspectivas cinematográficas
✅ Validación de coherencia para evitar contradicciones en combinaciones

## Desarrollo

El proyecto usa ES Modules para una mejor organización del código. Todos los imports utilizan la sintaxis moderna de JavaScript.

### Arquitectura de Builders

El proyecto utiliza funciones especializadas "builders" que generan diferentes secciones del prompt:

- **`summary-builder.js`**: Genera el resumen/introducción del prompt
  - Modo "spicy": Elige de `summary-spicy.json`
  - Modo "zero": Devuelve exactamente "A professional photo of a woman."
  - Otros modos: Elige de `summary.json`

- **`model-builder.js`**: Construye la descripción de la modelo combinando:
  - Ojos (eyes.json)
  - Cabello (hair.json)
  - Cuerpo (usando body-builder)
  - Tono de piel (skin-tones.json)

- **`body-builder.js`**: Describe el cuerpo combinando:
  - Tipo de cuerpo (body-types.json)
  - Forma corporal (body-shapes.json)
  - Proporciones (body-proportions.json)
  - Detalles (body-details.json)

- **`camera-builder.js`**: Construye la descripción de cámara con:
  - Plano/framing (shots.json)
  - Ángulo de cámara (angles.json)
  - Composición (compositions.json)

- **`finish-builder.js`**: Genera la sección de calidad y acabados:
  - Calidad de imagen (quality.json)
  - Acabados fotográficos (finishes.json)

Cada builder es independiente y puede ser reutilizado o extendido según necesidades.

## Coherencia de Datos

El proyecto garantiza coherencia en la generación de prompts mediante una separación clara de conceptos en los datos:

### Separación de Propósitos en Datos

**Descripción del Cuerpo:**
- **body-types.json** (24 items): Volumen/peso corporal (slender, muscular, plus-size, etc.)
- **body-shapes.json** (25 items): Distribución de volumen/silueta (hourglass, pear, apple, rectangular, etc.)
- **body-proportions.json** (25 items): Proporciones específicas (limb length, waist-hip ratio, shoulder width, etc.)
- **body-details.json** (25 items): Textura y definición muscular (muscle striations, skin luminosity, etc.)
  - ➜ Combinadas en `body-builder.js` para descripciones coherentes del cuerpo

**Descripción de Cámara:**
- **shots.json** (26 items): Tamaño de frame y body positioning (close-up, waist-up, full-body, sitting, reclining, etc.)
- **angles.json** (25 items): Perspectiva de cámara SOLO (eye-level, low-angle, high-angle, dutch angle, wide lens, telephoto, etc.)
- **compositions.json** (20 items): Estructura visual (rule of thirds, golden ratio, leading lines, depth layering, etc.)
  - ➜ Combinadas en `camera-builder.js` para descripciones coherentes de cámara

**Calidad y Acabados:**
- **quality.json** (20 items): Resolución y realismo SOLO (4k, 8k, hyperrealistic, photorealistic, anatomically precise, etc.)
- **finishes.json** (30 items): Estilos fotográficos y acabados (editorial, neo-noir, vintage film, fine art, etc.)
  - ➜ Separados intencionalmente para evitar redundancias

### Validaciones de Coherencia

Esta separación asegura que combinaciones aleatorias no produzcan contradicciones lógicas. Por ejemplo:
- ✅ "full-body shot" + "eye-level perspective" + "centered composition" = Coherente
- ✅ "close-up shot" + "high-angle view" + "rule of thirds" = Coherente
- ❌ "close-up shot" + "bird's eye overhead view" = Evitado (perspectivas incompatibles)

Todos los JSON han sido validados para garantizar:
- No hay términos duplicados exactos
- Las separaciones de concepto son claras
- Las combinaciones generadas son visualmente coherentes para z-image turbo

## Licencia
