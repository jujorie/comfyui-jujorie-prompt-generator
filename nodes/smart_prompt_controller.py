import time
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DEFAULT_PROMPT_SERVER = "http://localhost:3005/prompt/closeup?mode=spicy&format=text"

class SmartPromptController:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "fetch": (
                    "BOOLEAN",
                    {
                        "default": False
                    }
                ),
                "url": (
                    "STRING",
                    {
                        "default": DEFAULT_PROMPT_SERVER,
                        "multiline": False
                    }
                ),
                "prompt": (
                    "STRING",
                    {
                        "default": "",
                        "multiline": True
                    }
                )
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt",)
    FUNCTION = "process_prompt"
    CATEGORY = "utils/prompt"

    def process_prompt(self, fetch, url, prompt):
        return (prompt,)

    @classmethod
    def IS_CHANGED(cls, fetch, url, prompt):
        if fetch:
            # Always fetch, always update cache
            result = float(time.time())
            logger.debug(f"[SmartPromptController.IS_CHANGED] Fetch mode: returning timestamp for continuous updates")
            return result
        else:
            # Manual mode: only change if prompt text differs
            logger.debug(f"[SmartPromptController.IS_CHANGED] Manual mode: using prompt hash")
            return prompt
