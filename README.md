# ComfyUI Prompt Fetch Nodes

Suite of custom nodes for ComfyUI that fetch prompts from URLs and provide smart prompt control.

**Este repo contiene:**
- **Raíz:** Custom nodes de ComfyUI (nodos Python + extensiones web JavaScript)
- **`/web`:** Servidor Node.js que genera prompts dinámicamente

## Project Structure

```
.
├── nodes/                        # Custom node implementations
│   ├── __init__.py
│   ├── prompt_fetch_node.py     # Fetch prompt from URL node
│   └── smart_prompt_controller.py # Smart prompt control node
├── web/                          # Web server + JS extensions
│   ├── server.js
│   ├── package.json
│   ├── js/
│   │   └── smart_prompt_controller.js  # UI widget updater extension
│   └── data/                     # JSON data for prompt generation
├── __init__.py                   # Package init (exports nodes + WEB_DIRECTORY)
├── requirements.txt
└── pyproject.toml
```

## Nodes

### 1. Fetch Prompt From URL
Simple node that fetches a prompt from an HTTP endpoint.

**Inputs:**
- `url` (STRING): Endpoint URL
- `refresh` (BOOLEAN): Trigger cache refresh

**Outputs:**
- `prompt` (STRING): Fetched prompt text

**Use case:** Direct integration with external prompt generators

### 2. Smart Prompt Controller ⭐
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
3. The prompt is fetched from the URL
4. The INPUT `prompt` widget updates automatically with the fetched value
5. The OUTPUT `prompt` is sent to CLIP Text Encode

## Features

- ✓ Fetch prompt from HTTP endpoint
- ✓ Works with text and JSON endpoints
- ✓ Smart prompt controller with dual-mode operation
- ✓ Real-time UI widget updates via JavaScript
- ✓ Persistent values in workflow JSON
- ✓ Default prompt server included (`/web`)
- ✓ Simple integration with CLIP Text Encode
- ✓ Timeout control (2000ms default)
- ✓ Detailed error messages

## Installation

### Manual install

Clone into custom_nodes:

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/YOUR_USERNAME/comfyui-prompt-fetch-node
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the prompt server (optional, for dynamic generation):

```bash
cd web
npm install
npm start
```

Restart ComfyUI completely so it loads the new nodes and web extensions.

**⚠️ Important:** After installing, ComfyUI must be fully restarted to detect:
- New node classes
- JavaScript extension for UI updates

## Example Usage

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
    # Node metadata
    COLOR = "#2ecc71"          # Hex color (node header)
    BGCOLOR = "#1e8449"        # Hex color (node background)
    
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

**File:** `web/js/smart_prompt_controller.js`

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

**Extension structure:**
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