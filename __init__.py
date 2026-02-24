from .nodes import FetchPromptFromURL, SmartPromptController, SmartClipController, PromptURLBuilder, SmartVRAMClear, ConditionalPass, ConditionalPassImage
import os

# Node registration
NODE_CLASS_MAPPINGS = {
    "FetchPromptFromURL": FetchPromptFromURL,
    "SmartPromptController": SmartPromptController,
    "SmartClipController": SmartClipController,
    "PromptURLBuilder": PromptURLBuilder,
    "SmartVRAMClear": SmartVRAMClear,
    "ConditionalPass": ConditionalPass,
    "ConditionalPassImage": ConditionalPassImage,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "FetchPromptFromURL": "Fetch Prompt From URL",
    "SmartPromptController": "Smart Prompt Controller",
    "SmartClipController": "Smart Clip Controller",
    "PromptURLBuilder": "Prompt URL Builder",
    "SmartVRAMClear": "Smart VRAM Clear (Memory Safe)",
    "ConditionalPass": "Conditional Pass (Any Type)",
    "ConditionalPassImage": "Conditional Pass (Image)",
}

# Web extensions - ComfyUI will load JavaScript files from this directory
WEB_DIRECTORY = "./web"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]