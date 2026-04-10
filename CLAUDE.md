# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A ComfyUI custom node package. It ships Python node classes and JavaScript UI extensions that ComfyUI loads at startup. There is also an optional standalone Node.js prompt-generation server in `server/`.

## How ComfyUI loads this package

- `__init__.py` exports `NODE_CLASS_MAPPINGS`, `NODE_DISPLAY_NAME_MAPPINGS`, and `WEB_DIRECTORY = "./web"`.
- ComfyUI auto-discovers every `.js` file in `web/` and serves them to the frontend.
- Each JS file calls `app.registerExtension({ name, nodeCreated })` to hook into the canvas.
- Python HTTP routes are registered in `nodes/api.py` using `@PromptServer.instance.routes.*` decorators and imported in `nodes/__init__.py` so the decorators execute at load time.

**After any change, ComfyUI must be fully restarted** — there is no hot-reload.

## Development commands

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the optional prompt-generation server
cd server && npm install && npm start   # runs on localhost:3005
```

There are no automated tests or linters configured.

## Architecture

### Python nodes (`nodes/`)

| File | Purpose |
|---|---|
| `prompt_manager_node.py` | Saves/loads prompts; reads list from `prompt_db.py` to populate the `select` combo |
| `prompt_db.py` | Persist prompts as individual JSON files under `user/prompt_manager/` (keyed by MD5 hash) |
| `api.py` | Registers three aiohttp routes: `GET /prompt_manager/list`, `POST /prompt_manager/get`, `POST /prompt_manager/delete` |
| `prompt_fetch_node.py` | Simple HTTP fetch node |
| `smart_prompt_controller.py` | Dual-mode node (manual / URL fetch); uses `IS_CHANGED` for cache-busting |
| `smart_clip_controller.py` | Same as above but outputs CLIP conditioning |
| `prompt_url_builder.py` | Builds URL strings for the Node.js server |
| `smart_vram_clear.py` | Pass-through node that clears CUDA/ComfyUI memory |
| `conditional_pass.py` | Pass-through node that raises an error (blocking execution) when `enabled=False` |

### JavaScript extensions (`web/`)

| File | Node(s) it targets |
|---|---|
| `prompt_manager_interactive.js` | `PromptManagerNode` — adds a "Manage Prompts" button that opens a modal to list/delete saved prompts and then refreshes the `select` combo via `selectWidget.options.values` |
| `smart_prompt_controller.js` | `SmartPromptController` — hooks `onExecuted` to write fetched prompt back into the widget |
| `conditional_pass_color.js` | `ConditionalPass`, `ConditionalPassImage` — changes node color green/red based on `enabled` toggle |
| `json_to_prompt.js` | `JSONToPrompt` — inline JSON editor widget |
| `appearance.js` | Global UI tweaks |

### Node.js server (`server/`)

Express server that generates random Stable Diffusion prompts from JSON datasets in `server/data/`. Endpoints: `/prompt`, `/prompt/closeup`. Used by `FetchPromptFromURL` and `SmartPromptController` nodes but is entirely optional.

## Key conventions

- **New node**: add the Python class in `nodes/`, import and export it in `nodes/__init__.py`, and add entries to both mappings in `__init__.py`. If it needs UI behaviour, add a matching `web/<name>.js`.
- **New API route**: add it in `nodes/api.py` and import the function in `nodes/__init__.py`.
- **Combo widget refresh from JS**: update `widget.options.values`, reset `widget.value` if the current value was removed, then call `node.setDirtyCanvas(true, true)`.
- `COLOR` / `BGCOLOR` node properties are **not supported** by current ComfyUI versions — do not add them.
