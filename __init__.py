from .nodes import FetchPromptFromURL

# Node registration
NODE_CLASS_MAPPINGS = {
    "FetchPromptFromURL": FetchPromptFromURL,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "FetchPromptFromURL": "Fetch Prompt From URL",
}

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]