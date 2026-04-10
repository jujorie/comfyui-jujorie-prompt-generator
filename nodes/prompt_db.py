import os
import json
import hashlib
import time

BASE = os.getcwd()
PROMPT_DIR = os.path.join(BASE, "user", "prompt_manager")

os.makedirs(PROMPT_DIR, exist_ok=True)


def md5(text):
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def path(pid):
    return os.path.join(PROMPT_DIR, pid + ".json")


def list_prompts():

    result = []

    for f in os.listdir(PROMPT_DIR):

        if not f.endswith(".json"):
            continue

        p = os.path.join(PROMPT_DIR, f)

        with open(p, "r", encoding="utf8") as fp:
            data = json.load(fp)

        result.append(data)

    return result


def save_prompt(prompt):

    pid = md5(prompt)

    p = path(pid)

    if not os.path.exists(p):

        data = {
            "id": pid,
            "prompt": prompt,
            "tags": [],
            "rating": 0,
            "favorite": False,
            "created": int(time.time())
        }

        with open(p, "w", encoding="utf8") as f:
            json.dump(data, f, indent=2)

    return pid


def load_prompt(pid):

    p = path(pid)

    if not os.path.exists(p):
        return ""

    with open(p, "r", encoding="utf8") as f:
        data = json.load(f)

    return data["prompt"]


def delete_prompt(pid):

    p = path(pid)

    if os.path.exists(p):
        os.remove(p)