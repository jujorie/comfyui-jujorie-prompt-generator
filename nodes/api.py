from aiohttp import web
from server import PromptServer

from .prompt_db import list_prompts, delete_prompt, load_prompt


@PromptServer.instance.routes.get("/prompt_manager/list")
async def list_api(request):

    page      = int(request.rel_url.query.get("page", 0))
    page_size = int(request.rel_url.query.get("page_size", 20))

    prompts, total = list_prompts(page=page, page_size=page_size)

    return web.json_response({"prompts": prompts, "total": total, "page": page, "page_size": page_size})


@PromptServer.instance.routes.post("/prompt_manager/delete")
async def delete_api(request):

    data = await request.json()

    delete_prompt(data["id"])

    return web.json_response({"status": "ok"})


@PromptServer.instance.routes.post("/prompt_manager/get")
async def get_api(request):

    data = await request.json()

    prompt = load_prompt(data["id"])

    return web.json_response({"prompt": prompt} if prompt else {"prompt": None})