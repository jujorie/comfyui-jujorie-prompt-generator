import requests

DEFAULT_PROMPT_SERVER = "http://localhost:3005/prompt/closeup?mode=spicy&format=text"

class FetchPromptFromURL:
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
                )
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt",)
    FUNCTION = "fetch_prompt"
    CATEGORY = "utils/prompt"

    def fetch_prompt(self, url):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            prompt = response.text.strip()
        except Exception as e:
            prompt = f"Error fetching prompt: {str(e)}"

        return (prompt,)


NODE_CLASS_MAPPINGS = {
    "FetchPromptFromURL": FetchPromptFromURL
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "FetchPromptFromURL": "Fetch Prompt From URL"
}