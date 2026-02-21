import requests
import time
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DEFAULT_PROMPT_SERVER = "http://localhost:3005/prompt/closeup?mode=spicy&format=text"

class SmartPromptController:
    COLOR = "#3498db"      # color del nodo (azul)
    BGCOLOR = "#2c3e50"    # fondo oscuro

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
        """
        Process prompt based on fetch mode.
        
        Returns the final prompt (updated in OUTPUT in real-time):
        - fetch=False: returns the manual prompt input
        - fetch=True: fetches prompt from URL and returns it (overwrites manual input)
        """
        logger.debug(f"[SmartPromptController] fetch={fetch}, url={url}")
        
        if fetch:
            try:
                logger.debug(f"[SmartPromptController] Fetching from {url}...")
                response = requests.get(url, timeout=2.0)
                response.raise_for_status()
                fetched_prompt = response.text.strip()
                logger.debug(f"[SmartPromptController] Fetched successfully. Length: {len(fetched_prompt)} chars")
                logger.debug(f"[SmartPromptController] Content preview: {fetched_prompt[:100]}...")
                return (fetched_prompt,)
            except requests.exceptions.Timeout:
                logger.error(f"[SmartPromptController] Timeout fetching from {url}")
                raise Exception(f"Timeout fetching prompt from {url} (2000ms exceeded)")
            except requests.exceptions.ConnectionError as e:
                logger.error(f"[SmartPromptController] Connection error: {e}")
                raise Exception(f"Connection error fetching prompt from {url}: {str(e)}")
            except requests.exceptions.HTTPError as e:
                logger.error(f"[SmartPromptController] HTTP error: {e}")
                raise Exception(f"HTTP error {response.status_code} fetching prompt from {url}: {str(e)}")
            except Exception as e:
                logger.error(f"[SmartPromptController] Unexpected error: {e}")
                raise Exception(f"Error fetching prompt from {url}: {str(e)}")
        else:
            logger.debug(f"[SmartPromptController] Manual mode. Prompt length: {len(prompt)} chars")
            return (prompt,)

    @classmethod
    def IS_CHANGED(cls, fetch, url, prompt):
        """
        Control cache invalidation.
        
        - If fetch=True: always invalidate cache to allow continuous updates from server
        - If fetch=False: only invalidate if the manual prompt text changes
        """
        logger.debug(f"[SmartPromptController.IS_CHANGED] fetch={fetch}")
        if fetch:
            # Always fetch, always update cache
            result = float(time.time())
            logger.debug(f"[SmartPromptController.IS_CHANGED] Fetch mode: returning timestamp for continuous updates")
            return result
        else:
            # Manual mode: only change if prompt text differs
            logger.debug(f"[SmartPromptController.IS_CHANGED] Manual mode: using prompt hash")
            return prompt
