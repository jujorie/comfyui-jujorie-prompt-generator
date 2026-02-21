from .nodes import FetchPromptFromURL, SmartPromptController
import os

# Node registration
NODE_CLASS_MAPPINGS = {
    "FetchPromptFromURL": FetchPromptFromURL,
    "SmartPromptController": SmartPromptController,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "FetchPromptFromURL": "Fetch Prompt From URL",
    "SmartPromptController": "Smart Prompt Controller",
}

# Web extensions - ComfyUI will load JavaScript files from this directory
WEB_DIRECTORY = "./web"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]