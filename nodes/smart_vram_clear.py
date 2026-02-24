import torch
import gc
import time

try:
    import comfy.model_management as mm
except:
    mm = None


def get_memory():
    if not torch.cuda.is_available():
        return 0, 0
    allocated = torch.cuda.memory_allocated()
    reserved = torch.cuda.memory_reserved()
    return allocated, reserved


def gb(x):
    return x / (1024 ** 3)


class SmartVRAMClear:
    COLOR = "#6b0000"
    BGCOLOR = "#2b0000"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "input": ("*", {}),
                "enabled": ("BOOLEAN", {"default": True}),
                "fragmentation_ratio": ("FLOAT", {
                    "default": 1.4,
                    "min": 1.1,
                    "max": 3.0,
                    "step": 0.1
                }),
                "aggressive": ("BOOLEAN", {"default": False})
            }
        }

    RETURN_TYPES = ("*",)
    RETURN_NAMES = ("output",)
    FUNCTION = "run"
    CATEGORY = "utils/memory"

    def run(self, input, enabled, fragmentation_ratio, aggressive):
        if not enabled:
            return (input,)

        try:
            alloc_before, res_before = get_memory()

            fragmentation = 0
            if alloc_before > 0:
                fragmentation = res_before / alloc_before

            do_deep = aggressive or fragmentation > fragmentation_ratio

            print(
                f"[SmartVRAM] allocated={gb(alloc_before):.2f}GB "
                f"reserved={gb(res_before):.2f}GB "
                f"frag_ratio={fragmentation:.2f}"
            )

            # Stage 1: Python cleanup
            gc.collect()
            print("[SmartVRAM] Stage 1: Python garbage collection completed")

            # Stage 2: Torch cleanup
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                torch.cuda.ipc_collect()
                print("[SmartVRAM] Stage 2: Torch cache cleared and IPC collected")
            else:
                print("[SmartVRAM] Stage 2: CUDA not available, skipping Torch cleanup")

            # Stage 3: ComfyUI cleanup
            if mm is not None:
                try:
                    mm.soft_empty_cache()
                    print("[SmartVRAM] Stage 3a: ComfyUI soft cache cleared")
                except Exception as e:
                    print(f"[SmartVRAM] Stage 3a error: {e}")

                if do_deep:
                    try:
                        mm.unload_all_models()
                        print("[SmartVRAM] Stage 3b: All models unloaded (aggressive mode)")
                    except Exception as e:
                        print(f"[SmartVRAM] Stage 3b error: {e}")
            else:
                print("[SmartVRAM] Stage 3: ComfyUI model management not available")

            # Stage 4: Sync GPU
            if torch.cuda.is_available():
                torch.cuda.synchronize()
                print("[SmartVRAM] Stage 4: GPU synchronized")

            alloc_after, res_after = get_memory()

            freed = gb(res_before - res_after)

            mode = "AGGRESSIVE" if do_deep else "NORMAL"

            print(
                f"[SmartVRAM] mode={mode} freed={freed:.2f}GB "
                f"new_reserved={gb(res_after):.2f}GB"
            )

        except Exception as e:
            print(f"[SmartVRAM] error: {e}")

        return (input,)

    @classmethod
    def IS_CHANGED(cls, input, enabled, fragmentation_ratio, aggressive):
        if enabled:
            return time.time()
        return input
