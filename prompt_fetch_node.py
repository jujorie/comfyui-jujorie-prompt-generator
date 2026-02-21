import requests
import time

DEFAULT_PROMPT_SERVER = "http://localhost:3005/prompt/closeup?mode=spicy&format=text"

class FetchPromptFromURL:
    COLOR = "#2ecc71"      # color del nodo (verde)
    BGCOLOR = "#1e8449"    # fondo de

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "url": (
                    "STRING",
                    {
                        "default": DEFAULT_PROMPT_SERVER,
                        "multiline": False
                    },
                ),
                "refresh": (
                    "BOOLEAN",
                    {
                        "default": False
                    }
                )
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt",)
    FUNCTION = "fetch_prompt"
    CATEGORY = "utils/prompt"

    def fetch_prompt(self, url, refresh):
        # Truco para invalidar cache de ComfyUI
        if refresh:
            _ = time.time()

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            prompt = response.text.strip()
        except Exception as e:
            prompt = f"Error fetching prompt: {str(e)}"

        return (prompt,)

    @classmethod
    def IS_CHANGED(cls, url, refresh):
        # Si refresh está activado, siempre cambia
        if refresh:
            return float(time.time())
        return url