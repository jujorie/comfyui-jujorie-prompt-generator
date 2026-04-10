from .prompt_db import save_prompt, load_prompt, list_prompts


class PromptManagerNode:

    CATEGORY = "utils/prompt"
    FUNCTION = "run"

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt",)

    @classmethod
    def INPUT_TYPES(cls):

        prompts = ["none"]

        recent, _ = list_prompts(limit=20)

        for p in recent:
            preview = p["prompt"][:40].replace("\n", " ")
            prompts.append(f'{p["id"]} | {preview}')

        return {
            "required": {
                "prompt": ("STRING", {"multiline": True}),
                "select": (prompts,),
                "should_save": ("BOOLEAN", {"default": True})
            }
        }

    def run(self, prompt, select, should_save):

        if prompt.strip() and should_save:
            save_prompt(prompt)

        if select != "none":

            pid = select.split(" | ")[0]

            loaded = load_prompt(pid)

            if loaded:
                prompt = loaded

        return (prompt,)