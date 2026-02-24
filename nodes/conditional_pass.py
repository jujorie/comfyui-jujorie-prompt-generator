import time


class ConditionalPass:
    """
    Nodo interruptor que controla el flujo de un workflow.
    
    Permite pasar o bloquear la ejecución de nodos downstream basándose en un booleano.
    Caso de uso: Generar imagen rápida -> [AQUÍ] -> Upscaler
    - Si enabled=True: pasa la imagen al upscaler
    - Si enabled=False: bloquea el flujo (upscaler no se ejecuta)
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "input": ("*", {}),
                "enabled": ("BOOLEAN", {"default": True}),
                "error_message": ("STRING", {
                    "default": "Workflow blocked by Conditional Pass",
                    "multiline": False
                })
            }
        }

    RETURN_TYPES = ("*",)
    RETURN_NAMES = ("output",)
    FUNCTION = "process"
    CATEGORY = "utils/flow"

    def process(self, input, enabled, error_message):
        if not enabled:
            raise RuntimeError(f"[ConditionalPass] ❌ {error_message}")
        
        print(f"[ConditionalPass] ✓ Workflow enabled, passing input forward")
        return (input,)

    @classmethod
    def IS_CHANGED(cls, input, enabled, error_message):
        return time.time() if enabled else 0


# Para compatibilidad con múltiples tipos
class ConditionalPassImage:
    """Versión específica para imágenes (mejor debugging)"""

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE", {}),
                "enabled": ("BOOLEAN", {"default": True}),
                "error_message": ("STRING", {
                    "default": "Image upscaling blocked",
                    "multiline": False
                })
            }
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)
    FUNCTION = "process"
    CATEGORY = "utils/flow"

    def process(self, image, enabled, error_message):
        if not enabled:
            raise RuntimeError(f"[ConditionalPass] ❌ {error_message}")
        
        print(f"[ConditionalPass] ✓ Image passed forward (resolution: {image.shape})")
        return (image,)

    @classmethod
    def IS_CHANGED(cls, image, enabled, error_message):
        return time.time() if enabled else 0


NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}
