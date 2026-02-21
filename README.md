# ComfyUI Prompt Fetch Node

Custom node for ComfyUI that fetches a prompt from a URL and returns it as a STRING.

Useful for:
- Dynamic prompts
- Prompt servers
- External prompt generators
- Automation pipelines

Default endpoint:
http://localhost:3005/prompt/closeup?mode=spicy&format=text

## Node

Name:
Fetch Prompt From URL

Category:
utils/prompt

## Features

- Fetch prompt from HTTP endpoint
- Works with text endpoints
- Default prompt server included
- Simple integration with CLIP Text Encode

## Installation

### Manual install

Clone into custom_nodes:

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/YOUR_USERNAME/comfyui-prompt-fetch-node
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Restart ComfyUI.

## Example usage

1. Add node **Fetch Prompt From URL**
2. Connect output to:
CLIP Text Encode (prompt)

## Input

url  
Prompt server URL.

Example:
http://localhost:3005/prompt/closeup?mode=spicy&format=text

## Output

prompt (STRING)

## Example prompt server response

```
cinematic close-up portrait of a cyberpunk woman, neon lighting, ultra detailed
```

## Compatibility

Tested with:
- ComfyUI latest versions
- Python 3.10+