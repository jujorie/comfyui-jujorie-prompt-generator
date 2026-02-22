"""
Prompt URL Builder - Construye URLs dinámicas para el servidor de prompts.
Sin entradas requeridas, solo parámetros configurables del nodo.
"""

from typing import Dict, Any


class PromptURLBuilder:
    """
    Custom node que construye URLs completas para solicitar prompts
    desde el servidor de generación dinámica.
    """

    COLOR = "#FF6B6B"
    BGCOLOR = "#C92A2A"

    @classmethod
    def INPUT_TYPES(cls) -> Dict[str, Dict[str, Any]]:
        """Define los parámetros configurables del nodo."""
        return {
            "required": {
                "host": (
                    "STRING",
                    {
                        "default": "http://localhost:3005",
                        "multiline": False,
                    },
                ),
                "endpoint": (
                    ["prompt", "prompt/closeup"],
                    {"default": "prompt"},
                ),
                "mode": (
                    ["", "zero", "cinematic", "detailed", "spicy"],
                    {"default": ""},
                ),
                "style": ("STRING", {"default": ""}),
                "lighting": ("STRING", {"default": ""}),
                "eyes": ("STRING", {"default": ""}),
                "hair": ("STRING", {"default": ""}),
                "skin": ("STRING", {"default": ""}),
            },
            "optional": {
                # Parámetros específicos de /prompt (no para /prompt/closeup)
                "bodyTypes": ("STRING", {"default": ""}),
                "bodyShapes": ("STRING", {"default": ""}),
                "bodyProportions": ("STRING", {"default": ""}),
                "bodyDetails": ("STRING", {"default": ""}),
                "shots": ("STRING", {"default": ""}),
                "angles": ("STRING", {"default": ""}),
                "compositions": ("STRING", {"default": ""}),
                "locations": ("STRING", {"default": ""}),
                "poses": ("STRING", {"default": ""}),
                "quality": ("STRING", {"default": ""}),
                "finishes": ("STRING", {"default": ""}),
                "summary": ("STRING", {"default": ""}),
                "summarySpicy": ("STRING", {"default": ""}),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("url",)
    FUNCTION = "build_url"
    CATEGORY = "prompt/utils"

    def build_url(
        self,
        host: str,
        endpoint: str,
        mode: str,
        style: str,
        lighting: str,
        eyes: str,
        hair: str,
        skin: str,
        bodyTypes: str = "",
        bodyShapes: str = "",
        bodyProportions: str = "",
        bodyDetails: str = "",
        shots: str = "",
        angles: str = "",
        compositions: str = "",
        locations: str = "",
        poses: str = "",
        quality: str = "",
        finishes: str = "",
        summary: str = "",
        summarySpicy: str = "",
    ) -> tuple:
        """
        Construye la URL con los parámetros especificados.
        
        - format siempre se añade automáticamente como 'text'
        - Los parámetros vacíos se omiten de la URL
        - Los parámetros mode vacío se omiten
        """

        # Parámetros que aplican a ambos endpoints
        common_params = {
            "mode": mode,
            "style": style,
            "lighting": lighting,
            "eyes": eyes,
            "hair": hair,
            "skin": skin,
        }

        # Parámetros solo para /prompt
        prompt_only_params = {
            "bodyTypes": bodyTypes,
            "bodyShapes": bodyShapes,
            "bodyProportions": bodyProportions,
            "bodyDetails": bodyDetails,
            "shots": shots,
            "angles": angles,
            "compositions": compositions,
            "locations": locations,
            "poses": poses,
            "quality": quality,
            "finishes": finishes,
            "summary": summary,
            "summarySpicy": summarySpicy,
        }

        # Seleccionar parámetros según el endpoint
        if endpoint == "prompt/closeup":
            params = common_params
        else:  # "prompt"
            params = {**common_params, **prompt_only_params}

        # Agregar format fijo
        params["format"] = "text"

        # Filtrar parámetros vacíos
        query_params = {k: v for k, v in params.items() if v}

        # Construir query string
        if query_params:
            query_string = "&".join(
                f"{key}={value}" for key, value in query_params.items()
            )
            url = f"{host}/{endpoint}?{query_string}"
        else:
            url = f"{host}/{endpoint}?format=text"

        return (url,)


# Registro del nodo
NODE_CLASS_MAPPINGS = {"PromptURLBuilder": PromptURLBuilder}

NODE_DISPLAY_NAME_MAPPINGS = {"PromptURLBuilder": "Prompt URL Builder"}
