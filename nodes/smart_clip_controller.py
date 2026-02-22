import time
import logging

from .constants import DEFAULT_PROMPT_SERVER

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class SmartClipController:
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
                ),
                "clip": (
                    "CLIP",
                    {
                    }
                )
            }
        }

    RETURN_TYPES = ("CONDITIONING",)
    RETURN_NAMES = ("conditioning",)
    FUNCTION = "process_clip"
    CATEGORY = "utils/prompt"

    def process_clip(self, fetch, url, prompt, clip):
        if clip is None:
            raise RuntimeError("ERROR: clip input is invalid: None\n\nIf the clip is from a checkpoint loader node your checkpoint does not contain a valid clip or text encoder model.")
        
        # Encode prompt using clip and generate conditioning
        tokens = clip.tokenize(prompt)
        return (clip.encode_from_tokens_scheduled(tokens),)

    @classmethod
    def IS_CHANGED(cls, fetch, url, prompt, clip):
        if fetch:
            # Always fetch, always update cache
            result = float(time.time())
            logger.debug(f"[SmartClipController.IS_CHANGED] Fetch mode: returning timestamp for continuous updates")
            return result
        else:
            # Manual mode: only change if prompt text differs
            logger.debug(f"[SmartClipController.IS_CHANGED] Manual mode: using prompt hash")
            return prompt
