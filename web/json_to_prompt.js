import { app } from "../../scripts/app.js";
import "./lib/jsoneditor.min.js";

let jsonEditorLoaded = false;

async function ensureJSONEditor() {

    if (jsonEditorLoaded) return;

    const base = "/extensions/comfyui-prompt-fetch-node/lib/";

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = base + "jsoneditor.min.css";
    document.head.appendChild(css);

    jsonEditorLoaded = true;
}

app.registerExtension({
    name: "custom.json_to_prompt",

    async nodeCreated(node) {

        if (node.comfyClass !== "JSONToPrompt")
            return;

        const widget = node.widgets.find(w => w.name === "json_text");
        if (!widget) return;

        widget.inputEl.style.display = "none";

        await ensureJSONEditor();

        setTimeout(() => {
            const container = document.createElement("div");
            container.style.height = "100%";

            widget.inputEl.parentElement.appendChild(container);

            const editor = new JSONEditor(container, {
                mode: "code",
                modes: ["tree", "code"],
                onChange: _onChange
            });

            try {
                const data = JSON.parse(widget.value || "{}");
                editor.set(data);
            } catch {
                editor.set({});
            }

            function _onChange() {
                try {
                    const json = editor.get();
                    widget.value = JSON.stringify(json, null, 2);
                } catch { }
            }

            node.onRemoved = () => {
                editor.destroy();
            };
        }, 1000);
    }
});