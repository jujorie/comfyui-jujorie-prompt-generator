# ComfyUI Jujorie Prompt Generator

Suite completa de nodos personalizados para ComfyUI que incluye generación dinámica de prompts, gestión de almacenamiento y control avanzado de prompts.

**Este repo contiene:**
- **`/nodes`:** Custom nodes de ComfyUI (Python) - 9+ nodos para gestión y control de prompts
- **`/web`:** Extensiones JavaScript para ComfyUI - UI enhancements y paneles interactivos
- **`/server`:** Servidor Node.js (opcional) que genera prompts dinámicamente con 30+ datasets

## Project Structure

```
.
├── nodes/                          # Custom node implementations (Python)
│   ├── __init__.py
│   ├── prompt_fetch_node.py        # Fetch prompt from URL node
│   ├── smart_prompt_controller.py  # Smart prompt control node
│   ├── smart_clip_controller.py    # Smart CLIP conditioning node
│   ├── prompt_url_builder.py       # URL builder for prompt server
│   ├── smart_vram_clear.py         # VRAM memory management node
│   ├── conditional_pass.py         # Flow control / conditional execution node
│   └── constants.py
├── web/                            # ComfyUI Web Extensions (JavaScript)
│   ├── smart_prompt_controller.js  # UI widget updater for prompt fetching
│   ├── conditional_pass_color.js   # Dynamic color feedback for conditional nodes
│   └── appearance.js               # UI appearance customizations
├── server/                         # Prompt Generator Server (Node.js)
│   ├── server.js                   # Main server entry point
│   ├── package.json
│   ├── Dockerfile
│   ├── src/                        # Server source code
│   │   ├── data-loader.js
│   │   ├── errors.js
│   │   ├── open-api.js
│   │   ├── openapi.json
│   │   ├── validations.js
│   │   ├── builders/               # Prompt builders (body, camera, etc.)
│   │   ├── routes/                 # API endpoints
│   │   ├── templates/              # Prompt templates
│   │   └── utils/                  # Helper utilities
│   └── data/                       # JSON datasets for prompt generation
│       ├── angles.json
│       ├── body-details.json
│       ├── body-proportions.json
│       ├── body-shapes.json
│       ├── body-types.json
│       ├── compositions.json
│       ├── eyes.json
│       ├── finishes.json
│       ├── hair.json
│       ├── lighting.json
│       ├── locations.json
│       ├── modes.json
│       ├── poses.json
│       ├── presets.json
│       ├── quality.json
│       ├── shots.json
│       ├── skin-tones.json
│       ├── summary-spicy.json
│       └── summary.json
├── docs/                           # Documentation
│   └── COMBINACIONES.md
├── __init__.py                     # Package init (exports nodes + WEB_DIRECTORY)
├── pyproject.toml
├── requirements.txt
└── README.md
```

## Nodes

### 1. Prompt Manager Node ⭐⭐⭐ (NEW!)
Almacena y carga prompts de forma persistente. Los prompts se guardan como archivos JSON individuales.

**Inputs:**
- `prompt` (STRING multiline): Prompt a almacenar o editar
- `select` (CHOICE): Selector de prompts previamente guardados
- `should_save` (BOOLEAN): Guarda el prompt en BD al ejecutar

**Outputs:**
- `prompt` (STRING): Prompt final (cargado de BD o manual)

**Features:**
- 💾 Almacenamiento persistente en `user/prompt_manager/`
- 📋 Panel visual interactivo para ver/buscar/borrar prompts
- 🔄 Refrescamiento automático de la lista al eliminar
- 🎨 Botón "📋 Prompt Manager" integrado en el nodo

**Uso:**
1. Escribe un prompt y marca `should_save=true` → se guarda en BD
2. Usa el dropdown `select` para cargar prompts previos
3. Haz clic en "📋 Prompt Manager" para abrir el panel de gestión
4. En el panel: busca, visualiza o borra prompts guardados

### 2. Fetch Prompt From URL
Simple node que obtiene un prompt desde una URL HTTP.

**Inputs:**
- `url` (STRING): URL del endpoint
- `refresh` (BOOLEAN): Forzar refrescamiento de cache

**Outputs:**
- `prompt` (STRING): Prompt obtenido

**Use case:** Integración directa con generadores externos de prompts

### 3. Smart Prompt Controller ⭐
Advanced node with dual-mode prompt control and automatic UI updates.

**Inputs:**
- `fetch` (BOOLEAN): Switch between manual and fetch mode
- `url` (STRING): Prompt server endpoint
- `prompt` (STRING): Manual prompt input (when fetch=false)

**Outputs:**
- `prompt` (STRING): Active prompt (auto-updates in UI)

**Features:**
- **Manual Mode** (`fetch=false`): Edit prompt directly in the widget
- **Fetch Mode** (`fetch=true`): Automatically fetch from URL on each execution
- **Persistent Values**: Both manual and fetched prompts persist in workflow
- **Live UI Updates**: JavaScript extension updates the prompt widget in real-time
- **Error Handling**: Fetch errors (timeout, connection) interrupt the workflow with clear messages

**How it works:**
1. Set `fetch=true` and provide a `url`
2. Execute the workflow
3. Each execution fetches a fresh prompt and updates the widget

### 4. Smart CLIP Controller
Advanced node for CLIP conditioning with dual-mode operation (manual/fetch).

**Inputs:**
- `fetch` (BOOLEAN): Switch between manual and fetch mode
- `url` (STRING): Prompt server endpoint
- `prompt` (STRING): Manual prompt input
- `clip` (CLIP): CLIP model for encoding

**Outputs:**
- `conditioning` (CONDITIONING): Encoded prompt conditioning

**Use case:** Direct CLIP encoding with automatic prompt fetching

### 5. JSON To Prompt (NEW!)
Editor integrado de JSON dentro del nodo. Perfecto para editar estructuras de datos complejas.

**Inputs:**
- `json_data` (STRING): JSON a editar en el editor visual

**Outputs:**
- `json_str` (STRING): JSON formateado/validado

**Features:**
- ✓ Editor visual de JSON integrado
- ✓ Validación de sintaxis en tiempo real
- ✓ Formateo automático

**Use case:** Editar configuraciones complejas o estructuras de datos sin salir de ComfyUI

### 6. Prompt URL Builder
Dynamic URL builder for the prompt generation server.

**Inputs:**
- `host` (STRING): Server host (default: localhost:3005)
- `endpoint` (CHOICE): `/prompt` or `/prompt/closeup`
- `mode` (CHOICE): `zero`, `cinematic`, `detailed`, `spicy`
- `style`, `lighting`, `eyes`, `hair`, `skin` (STRING): Filter parameters
- Optional: `bodyTypes`, `bodyShapes`, `bodyProportions`, `bodyDetails`, `shots`, `angles`, `compositions`, `locations`, `poses`, `quality`, `finishes`, `summary`, `summarySpicy`

**Outputs:**
- `url` (STRING): Complete URL with all parameters

**Use case:** Build dynamic URLs for the prompt server without manual URL construction

### 7. Smart VRAM Clear 💾
Memory management node that intelligently clears VRAM, GPU cache, and Python garbage.

**Inputs:**
- `input` (ANY): Pass-through input (accepts any type)
- `enabled` (BOOLEAN): Toggle cleaning on/off
- `fragmentation_ratio` (FLOAT): Threshold for aggressive cleaning (default: 1.4, range: 1.1-3.0)
- `aggressive` (BOOLEAN): Force deep model unloading

**Outputs:**
- `output` (ANY): Same as input (pass-through)

**Features:**
- ✓ 4-stage memory cleanup:
  1. Python garbage collection
  2. PyTorch CUDA cache clearing
  3. ComfyUI model manager cleanup
  4. GPU synchronization
- ✓ Smart fragmentation detection (auto-aggressive mode)
- ✓ Detailed logging of freed memory
- ✓ Zero impact on workflow (input → output pass-through)
- ✓ Optional aggressive mode for deep model unloading

**Use case:** Place after image generation to clean VRAM before loading next model. Allows seamless multi-model workflows without OOM errors.

**Example workflow:**
```
Model Load → Generate Image → Smart VRAM Clear → Next Model Load → Generate
```

**Logs output:**
```
[SmartVRAM] allocated=2.45GB reserved=5.23GB frag_ratio=2.14
[SmartVRAM] Stage 1: Python garbage collection completed
[SmartVRAM] Stage 2: Torch cache cleared and IPC collected
[SmartVRAM] Stage 3a: ComfyUI soft cache cleared
[SmartVRAM] Stage 3b: All models unloaded (aggressive mode)
[SmartVRAM] Stage 4: GPU synchronized
[SmartVRAM] mode=AGGRESSIVE freed=2.15GB new_reserved=3.08GB
```

### 8. Conditional Pass 🔀
Flow control node that enables/disables execution of downstream nodes.

**Inputs:**
- `input` (ANY): Data to pass through
- `enabled` (BOOLEAN): Enable/disable workflow continuation
- `error_message` (STRING): Custom error message when disabled

**Outputs:**
- `output` (ANY): Same as input (or raises error if disabled)

**Features:**
- ✓ Universal pass-through (works with any data type)
- ✓ Blocks downstream execution when disabled
- ✓ Custom error messages for clarity

**Use case:** Generate fast image → [Conditional Pass] → Upscaler

### 9. Conditional Pass (Image) 🖼️
Specialized version for images with better debugging output.

**Inputs:**
- `image` (IMAGE): Image to pass through
- `enabled` (BOOLEAN): Enable/disable workflow continuation
- `error_message` (STRING): Custom error message when disabled

**Outputs:**
- `image` (IMAGE): Same image (or raises error if disabled)

**Features:**
- ✓ Type-safe image handling
- ✓ Logs image resolution when passing
- ✓ Better error messages for image-specific workflows

---

## API Endpoints

El paquete proporciona tres endpoints HTTP para gestión de prompts guardados (disponibles cuando ComfyUI está ejecutándose):

### GET `/prompt_manager/list`
Obtiene la lista de todos los prompts guardados.

**Response:**
```json
[
  {
    "id": "abc123def...",
    "prompt": "cinematic portrait of a woman..."
  },
  ...
]
```

### POST `/prompt_manager/get`
Obtiene un prompt específico por ID.

**Request Body:**
```json
{
  "id": "abc123def..."
}
```

**Response:**
```json
{
  "prompt": "cinematic portrait of a woman..."
}
```

### POST `/prompt_manager/delete`
Elimina un prompt guardado por ID.

**Request Body:**
```json
{
  "id": "abc123def..."
}
```

**Response:**
```json
{
  "status": "ok"
}
```

---

## JavaScript Extensions

Las extensiones JavaScript en `/web/` proporcionan UI enhancements y comportamientos especiales:

### 1. `prompt_manager_interactive.js`
Extiende el nodo `PromptManagerNode` para cargar automáticamente prompts desde la base de datos.

**Comportamiento:**
- Cuando cambias la selección en el dropdown `select`, automáticamente carga el prompt de la BD
- Rellena el campo de texto `prompt` con el contenido guardado
- Soporta la opción "none" para no cargar nada

### 2. `prompt_manager_panel.js` (NEW!)
Proporciona el panel visual de gestión de prompts con función de búsqueda.

**Features:**
- 🔍 Buscador en tiempo real
- 📋 Vista de todos los prompts guardados
- 🗑️ Botón para eliminar prompts
- 🔄 Refrescamiento automático de la lista del nodo al cerrar
- 🎨 Botón "📋 Prompt Manager" integrado en el nodo

**Uso:** Haz clic en el botón "📋 Prompt Manager" en el nodo para abrir el panel

### 3. `smart_prompt_controller.js`
Extiende el nodo `SmartPromptController` para actualizar el widget de prompt en tiempo real.

**Comportamiento:**
- Cuando se ejecuta en modo `fetch=true`, toma el prompt obtenido y lo muestra en el widget
- Actualiza automáticamente la UI sin necesidad de recargar el nodo

### 4. `conditional_pass_color.js`
Extiende los nodos `ConditionalPass` y `ConditionalPassImage` para cambiar color según estado.

**Comportamiento:**
- Nodo **verde** cuando `enabled=true` ✓
- Nodo **rojo** cuando `enabled=false` ✗

### 5. `json_to_prompt.js`
Proporciona editor visual integrado para el nodo `JSONToPrompt`.

**Features:**
- ✓ Editor de JSON con validación
- ✓ Resaltado de sintaxis
- ✓ Formateo automático

### 6. `appearance.js`
Customizaciones globales de la interfaz.

---

## Features

- ✅ Fetch prompt from HTTP endpoint
- ✅ Works with text and JSON endpoints
- ✅ Smart prompt controller with dual-mode operation
- ✅ Real-time UI widget updates via JavaScript
- ✅ Persistent values in workflow JSON
- ✅ Persistent prompt storage with database
- ✅ Interactive prompt manager panel with search/delete
- ✅ Default prompt server included (`/server`) with **dynamic filtering**
- ✅ Simple integration with CLIP Text Encode
- ✅ Timeout control (2000ms default)
- ✅ Detailed error messages
- ✅ Memory management (VRAM clearing)
- ✅ Conditional flow control

### Prompt Generator Server Features

- ✨ Generación de prompts aleatorios para z-image turbo (Stable Diffusion optimizado)
- 🎯 **Filtrado dinámico** en cualquier elemento del dataset (eyes, hair, skin, poses, etc.)
- 🔄 Búsqueda OR multi-valor: `?skin=pale&skin=porcelain`
- 📊 30+ datasets con 20-32 items cada uno
- ⚙️ 4 modos: zero, cinematic, detailed, spicy
- 🎨 12 presets predefinidos
- 📷 Endpoints: `/prompt` (general) y `/prompt/closeup` (primeros planos)
- 🎯 Lenguaje fotográfico profesional optimizado para Stable Diffusion

## Installation

### Manual install

Clone into custom_nodes:

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/jujorie/comfyui-jujorie-prompt-generator
```

Install Python dependencies:

```bash
cd comfyui-jujorie-prompt-generator
pip install -r requirements.txt
```

Start the prompt server (optional, for dynamic generation):

```bash
cd server
npm install
npm start
```

Restart ComfyUI completely so it loads the new nodes and web extensions.

**⚠️ Important:** After installing, ComfyUI must be fully restarted to detect:
- New node classes
- JavaScript extensions for UI updates

## Example Usage

### Prompt Manager (Storage) ⭐

**Guardar y gestionar prompts:**

1. Add node **Prompt Manager Node**
2. Escribe un prompt en el campo `prompt`
3. Establece `should_save` = `true`
4. Ejecuta el workflow → el prompt se guarda en BD
5. Haz clic en "📋 Prompt Manager" para abrir el panel
6. En el panel:
   - 🔍 Usa la búsqueda para encontrar prompts
   - 🗑️ Haz clic en "delete" para eliminar
   - Cierra el panel → se refrescan automáticamente las opciones del dropdown

**Result:** Los prompts se guardan persistentemente y puedes cargarlos fácilmente desde el dropdown.

### Smart Prompt Controller (Recommended)

**Setup for dynamic prompts:**

1. Add node **Smart Prompt Controller**
2. Set parameters:
   - `fetch` = `true` 
   - `url` = `http://localhost:3005/prompt/closeup?mode=spicy&format=text`
   - `prompt` = (empty or with fallback text)
3. Connect the `prompt` output to **CLIP Text Encode** (positive prompt)
4. Execute your workflow

**Result:** Each execution will automatically fetch a new prompt from the server, update the widget, and pass it to CLIP.

### Manual Mode in Smart Prompt Controller

**Use when you want to write prompts manually:**

1. In **Smart Prompt Controller**, set `fetch` = `false`
2. Edit the `prompt` field with your custom text
3. Connect output to CLIP Text Encode
4. Execute

**Result:** Uses your manual prompt. You can switch back to `fetch=true` anytime.

### Fetch Prompt From URL (Simple)

1. Add node **Fetch Prompt From URL**
2. Set URL to: `http://localhost:3005/prompt/closeup?mode=spicy&format=text`
3. optionally set `refresh` = `true` to force fetch on each execution
4. Connect `prompt` output to CLIP Text Encode

## Configuration

### Prompt Manager Node

**prompt** (STRING multiline)  
El prompt a almacenar o editar.

**select** (CHOICE)  
Selector de prompts guardados. Automáticamente cargará el prompt seleccionado.

**should_save** (BOOLEAN)  
Si es `true`, guarda el prompt actual en la BD al ejecutar.

### Smart Prompt Controller

**url** (STRING)  
Prompt server endpoint. Default:
```
http://localhost:3005/prompt/closeup?mode=spicy&format=text
```

**fetch** (BOOLEAN)  
- `true`: Fetch from URL on each execution  
- `false`: Use manual prompt input

**prompt** (STRING multiline)  
- When `fetch=false`: Your custom prompt text
- When `fetch=true`: Ignored (fetched value used instead)

### Fetch Prompt From URL

**url** (STRING)  
Prompt server endpoint.

Example:
```
http://localhost:3005/prompt/closeup?mode=spicy&format=text
```

**refresh** (BOOLEAN)  
Trigger cache refresh to force prompt generation.

## Output

**prompt** (STRING)  
Generated or fetched prompt text.

## Example prompt server response

```
cinematic close-up portrait of a cyberpunk woman, neon lighting, ultra detailed
```

---

## ComfyUI Custom Node Structure Reference

### Core Components

Every ComfyUI custom node requires a Python class with:

```python
class CustomNodeName:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "input_name": ("INPUT_TYPE", {"default": value, ...}),
            },
            "optional": {
                "opt_input": ("INPUT_TYPE", {...}),
            }
        }
    
    RETURN_TYPES = ("OUTPUT_TYPE1", "OUTPUT_TYPE2")
    RETURN_NAMES = ("output1", "output2")
    FUNCTION = "function_name"
    CATEGORY = "category/subcategory"
    
    def function_name(self, input_name, opt_input=None):
        # Processing logic
        return (result1, result2)
    
    @classmethod
    def IS_CHANGED(cls, **inputs):
        # Return float/hash if changed, else False/0
        # Used for cache invalidation
        return False
```

⚠️ **NOTE:** ComfyUI does NOT support `COLOR` and `BGCOLOR` properties (these were removed in recent versions). Remove them from node definitions.

### INPUT_TYPES Details

Supported input types:
- `"STRING"` - Text input (multiline, default options)
- `"INT"` - Integer input (min, max, step)
- `"FLOAT"` - Floating point (min, max, step)
- `"BOOLEAN"` - Checkbox
- Custom types: `"IMAGE"`, `"CONDITIONING"`, `"MODEL"`, etc.

Options per type:
```python
"field": ("STRING", {
    "default": "default value",
    "multiline": True,  # For longer text
    "dynamicPrompts": True  # Support dynamic prompts
})

"field": ("INT", {
    "default": 0,
    "min": 0,
    "max": 100,
    "step": 1
})
```

### Supported Node Properties

**✅ SUPPORTED:**
- `INPUT_TYPES` (classmethod)
- `RETURN_TYPES` (tuple)
- `RETURN_NAMES` (tuple)
- `FUNCTION` (string)
- `CATEGORY` (string)
- `IS_CHANGED` (classmethod)

**❌ NOT SUPPORTED (ComfyUI limitation):**
- `COLOR` - ❌ Removed in recent ComfyUI versions
- `BGCOLOR` - ❌ Removed in recent ComfyUI versions

### Node Registration

At module level (usually end of file):

```python
NODE_CLASS_MAPPINGS = {
    "InternalNodeName": CustomNodeName,
    "AnotherNode": AnotherNodeClass
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "InternalNodeName": "Display Name in UI",
    "AnotherNode": "Another Node Display Name"
}
```

### IS_CHANGED Method

Controls whether ComfyUI uses cached results:

```python
@classmethod
def IS_CHANGED(cls, url, refresh):
    if refresh:
        return float(time.time())  # Always changed
    return url  # Changed if URL differs
```

---

## ComfyUI Web Extensions (JavaScript)

This package includes JavaScript extensions that enhance node functionality in the ComfyUI UI.

### Smart Prompt Controller Widget Updater

**File:** `web/smart_prompt_controller.js`

**What it does:**
- Intercepts node execution results
- Automatically updates the `prompt` INPUT widget with fetched values
- Shows live updates in the ComfyUI UI

**How ComfyUI loads it:**
1. The `__init__.py` exposes `WEB_DIRECTORY` pointing to the `web/` folder
2. ComfyUI automatically discovers and loads JavaScript files in that directory
3. The extension registers itself with `app.registerExtension()`
4. When a **Smart Prompt Controller** node executes, the extension hooks into `onExecuted()`
5. The output prompt is extracted and updates the widget value

### Conditional Pass Color Indicator

**File:** `web/conditional_pass_color.js`

**What it does:**
- Dynamically changes node color based on `enabled` boolean state
- **Green** (`#2f8f2f` / `#1f5f1f`) when `enabled=True` → workflow passes through
- **Red** (`#8f2f2f` / `#5f1f1f`) when `enabled=False` → workflow blocked
- Updates in real-time as you toggle the `enabled` widget

**Applies to:**
- `ConditionalPass` (universal pass-through)
- `ConditionalPassImage` (image-specific pass-through)

**How it works:**
1. Detects when `enabled` widget changes
2. Updates node colors immediately
3. Redraw triggers to show visual feedback in canvas

**Example workflow visual:**
```
[Green node]  ✓ Workflow enabled, image passes forward
    ↓
[Upscaler executes]

[Red node]    ❌ Workflow blocked, upscaler skipped
    ↓
[Upscaler NOT executed]
```

## Extension structure
```javascript
app.registerExtension({
  name: "jujorie.SmartPromptController",
  
  nodeCreated(node, app) {
    if (node.comfyClass !== "SmartPromptController") return;
    
    // Hook execution callback
    node.onExecuted = function(message) {
      // Extract prompt output and update widget
      const promptWidget = this.widgets.find(w => w.name === "prompt");
      promptWidget.value = message[0]; // message[0] is the prompt output
    };
  }
});
```

### Creating Custom Web Extensions

For any custom node, you can create extensions following this pattern:

1. Create `web/js/your-node-name.js`:
```javascript
import { app } from "../../scripts/app.js";

app.registerExtension({
  name: "your-namespace.YourNodeName",
  
  nodeCreated(node, app) {
    if (node.comfyClass !== "YourNodeName") return;
    // Add custom UI logic here
  }
});
```

2. Ensure `__init__.py` has:
```python
WEB_DIRECTORY = os.path.join(os.path.dirname(__file__), "web")
```

3. Restart ComfyUI to load the extension



### Common Patterns

**Multiple outputs:**
```python
RETURN_TYPES = ("STRING", "INT", "IMAGE")
RETURN_NAMES = ("text", "count", "image")

def execute(self, ...):
    return (text_result, 42, image_tensor)
```

**Optional inputs:**
```python
"optional": {
    "seed": ("INT", {"default": 0})
}

def execute(self, required_param, seed=0):
    ...
```

## Web Server Integration

The `/web` folder contains a Node.js server that generates prompts dynamically:

- **Endpoints:** `/prompt/closeup`, `/prompt/generic`, etc.
- **Parameters:** `mode=spicy|casual`, `format=text|json`
- **Data sources:** JSON files in `/web/data/`
- **Builders:** Compose prompts from body-builder, camera-builder, etc.

The Python custom node fetches from these endpoints via HTTP.

## Compatibility

Tested with:
- ComfyUI latest versions
- Python 3.10+
- Node.js 16+