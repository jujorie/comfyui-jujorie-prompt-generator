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
- `style` (opcional): Estilo específico del preset (ej: "cinematic")
- `lighting` (opcional): Iluminación específica (ej: "natural", "studio")
- `mode` (opcional): Modo de generación - "cinematic", "spicy", "zero" (default: "cinematic")
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
│   ├── data-loader.js         # Cargador de archivos JSON de datos
│   ├── body-builder.js        # Constructor de descripción de cuerpo
│   ├── camera-builder.js      # Constructor de descripción de cámara
│   ├── model-builder.js       # Constructor de descripción de modelo
│   ├── finish-builder.js      # Constructor de descripción de finishes
│   ├── summary-builder.js     # Constructor de resumen/intro
│   └── utils/
│       └── random.js          # Funciones de selección aleatoria
├── data/
│   ├── angles.json            # Ángulos de cámara
│   ├── body-types.json        # Tipos de cuerpo (delgado, musculoso, etc.)
│   ├── body-shapes.json       # Formas corporales (hourglass, pear-shaped, etc.)
│   ├── body-proportions.json  # Proporciones (long-legged, petite, etc.)
│   ├── body-details.json      # Detalles corporales (muscle definition, etc.)
│   ├── compositions.json      # Composiciones visuales
│   ├── eyes.json              # Colores y tipos de ojos
│   ├── finishes.json          # Acabados de imagen
│   ├── hair.json              # Estilos de cabello
│   ├── lighting.json          # Tipos de iluminación
│   ├── locations.json         # Locaciones
│   ├── poses.json             # Poses
│   ├── presets.json           # Estilos predefinidos
│   ├── quality.json           # Calidad de imagen
│   ├── shots.json             # Tipos de planos
│   ├── skin-tones.json        # Tonos de piel
│   ├── summary.json           # Resúmenes/intros para prompts comunes
│   └── summary-spicy.json     # Resúmenes alternativos para modo "spicy"
├── package.json               # Dependencias y scripts
└── README.md                  # Este archivo
```

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

✨ Generación de prompts aleatorios personalizables
🎨 Múltiples datasets para diferentes elementos visuales
⚙️ Modos de generación (cinematic, fantasy, etc.)
🔧 Presets predefinidos para estilos específicos
📊 Endpoint para consultar todas las opciones disponibles

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

## Licencia

ISC
