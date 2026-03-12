import json


def flatten(obj):
    values = []

    def walk(o):
        if isinstance(o, dict):
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
        elif isinstance(o, str):
            s = o.strip()
            if s:
                values.append(s)

    walk(obj)
    return values


def apply_weight(values, weight, enable):
    if not enable:
        return values
    return [f"({v}:{weight})" for v in values]


class JSONToPrompt:

    CATEGORY = "utils/prompt"
    FUNCTION = "run"

    RETURN_TYPES = ("STRING", "STRING", "STRING")
    RETURN_NAMES = ("prompt", "negative_prompt", "debug")

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "json_text": ("STRING", {"multiline": True}),
                "enable_weights": ("BOOLEAN", {"default": True}),
            }
        }

    def run(self, json_text, enable_weights):

        try:
            data = json.loads(json_text)
        except Exception as e:
            raise Exception(f"Invalid JSON: {e}")

        sections = {
            "subject": [],
            "body": [],
            "clothing": [],
            "environment": [],
            "photography": [],
            "style": [],
            "extras": [],
            "constraints": []
        }

        mapping = {
            "subject": "subject",
            "body": "body",
            "pose": "body",
            "clothing": "clothing",
            "accessories": "clothing",
            "background": "environment",
            "environment": "environment",
            "photography": "photography",
            "camera": "photography",
            "the_vibe": "style",
            "style": "style"
        }

        for key, value in data.items():

            if key == "negative_prompt":
                continue

            if key == "constraints":
                if isinstance(value, dict) and "must_keep" in value:
                    sections["constraints"] += flatten(value["must_keep"])
                continue

            section = mapping.get(key, "extras")
            sections[section] += flatten(value)

        negative = ""

        if "negative_prompt" in data:
            if isinstance(data["negative_prompt"], list):
                negative = ", ".join(data["negative_prompt"])
            else:
                negative = str(data["negative_prompt"])

        weights = {
            "subject": 1.3,
            "body": 1.2,
            "clothing": 1.1,
            "environment": 1.0,
            "photography": 1.0,
            "style": 0.9,
            "extras": 0.9,
            "constraints": 1.4
        }

        prompt_parts = []

        for section, vals in sections.items():

            if not vals:
                continue

            vals = apply_weight(vals, weights[section], enable_weights)

            prompt_parts.extend(vals)

        prompt = ", ".join(prompt_parts)

        debug = json.dumps(sections, indent=2)

        return (prompt, negative, debug)
