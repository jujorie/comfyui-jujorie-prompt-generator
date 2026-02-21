# ComfyUI Prompt Fetch Node

Custom node for ComfyUI that fetches a prompt from a URL and returns it as a STRING.

**Este repo contiene:**
- **Raíz:** Custom nodes de ComfyUI (nodos Python)
- **`/web`:** Servidor Node.js que genera prompts dinámicamente

## Project Structure

```
.
├── prompt_fetch_node.py      # Custom node principal
├── __init__.py               # Python package init
├── requirements.txt          # Dependencias Python
├── pyproject.toml            # Metadatos del proyecto
└── web/                       # Servidor de generación de prompts
    ├── server.js
    ├── package.json
    └── src/
        ├── body-builder.js
        ├── camera-builder.js
        ├── template.js
        └── data/              # Datos JSON para generación
```

## Features

- Fetch prompt from HTTP endpoint
- Works with text endpoints
- Default prompt server included (`/web`)
- Simple integration with CLIP Text Encode
- Cache invalidation support

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

Restart ComfyUI.

## Example usage

1. Add node **Fetch Prompt From URL**
2. Set URL to: `http://localhost:3005/prompt/closeup?mode=spicy&format=text`
3. Connect output to CLIP Text Encode (prompt)

## Input

**url** (STRING)  
Prompt server URL.

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