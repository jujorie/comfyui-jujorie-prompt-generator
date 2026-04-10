import { app } from "../../scripts/app.js";

app.registerExtension({

    name: "prompt.manager.interactive",

    async nodeCreated(node) {

        if (node.comfyClass !== "PromptManagerNode") return;

        const selectWidget = node.widgets.find(w => w.name === "select");
        const promptWidget = node.widgets.find(w => w.name === "prompt");

        if (!selectWidget || !promptWidget) return;

        // Override select widget callback to load prompt text on selection
        const originalCallback = selectWidget.callback;

        selectWidget.callback = async (value) => {

            if (value === "none") {
                if (originalCallback) originalCallback.call(selectWidget, value);
                return;
            }

            const pid = value.split(" | ")[0];

            try {
                const response = await fetch("/prompt_manager/get", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: pid })
                });

                const data = await response.json();

                if (data && data.prompt) {
                    promptWidget.value = data.prompt;
                }

            } catch (error) {
                console.error("Error loading prompt:", error);
            }

            if (originalCallback) originalCallback.call(selectWidget, value);
        };

        // Rebuild select options from the API
        async function refreshSelectOptions() {
            try {
                const response = await fetch("/prompt_manager/list");
                const prompts = await response.json();

                const options = ["none"];

                for (const p of prompts) {
                    const preview = p.prompt.substring(0, 40).replace(/\n/g, " ");
                    options.push(`${p.id} | ${preview}`);
                }

                selectWidget.options.values = options;

                if (!options.includes(selectWidget.value)) {
                    selectWidget.value = "none";
                }

                node.setDirtyCanvas(true, true);

            } catch (error) {
                console.error("Error refreshing prompts:", error);
            }
        }

        // Open the manage-prompts modal
        function openPromptManager() {

            const overlay = document.createElement("div");
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.75);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            const dialog = document.createElement("div");
            dialog.style.cssText = `
                background: #1e1e2e;
                border: 1px solid #444;
                border-radius: 10px;
                padding: 20px;
                width: 560px;
                max-width: 90vw;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                gap: 14px;
                color: #e0e0e0;
                font-family: sans-serif;
                box-shadow: 0 8px 32px rgba(0,0,0,0.6);
            `;

            // Header
            const header = document.createElement("div");
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #333;
                padding-bottom: 12px;
            `;

            const title = document.createElement("span");
            title.textContent = "Prompt Manager";
            title.style.cssText = "font-size: 15px; font-weight: 600; color: #fff;";

            const closeBtn = document.createElement("button");
            closeBtn.textContent = "✕";
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: #888;
                font-size: 17px;
                cursor: pointer;
                padding: 2px 6px;
                border-radius: 4px;
                transition: color 0.15s;
            `;
            closeBtn.onmouseover = () => closeBtn.style.color = "#fff";
            closeBtn.onmouseout  = () => closeBtn.style.color = "#888";
            closeBtn.onclick = () => close();

            header.appendChild(title);
            header.appendChild(closeBtn);

            // List container
            const list = document.createElement("div");
            list.style.cssText = `
                overflow-y: auto;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-height: 60px;
            `;

            const loading = document.createElement("div");
            loading.textContent = "Loading…";
            loading.style.cssText = "color: #777; text-align: center; padding: 24px;";
            list.appendChild(loading);

            dialog.appendChild(header);
            dialog.appendChild(list);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            function close() {
                document.body.removeChild(overlay);
                refreshSelectOptions();
            }

            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) close();
            });

            // Render a single prompt row
            function renderItem(p) {
                const item = document.createElement("div");
                item.style.cssText = `
                    background: #16213e;
                    border: 1px solid #2a2a3e;
                    border-radius: 6px;
                    padding: 10px 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 10px;
                `;

                const textDiv = document.createElement("div");
                textDiv.style.cssText = "flex: 1; overflow: hidden;";

                const preview = document.createElement("div");
                preview.textContent =
                    p.prompt.substring(0, 120) + (p.prompt.length > 120 ? "…" : "");
                preview.style.cssText = `
                    font-size: 13px;
                    color: #ccc;
                    word-break: break-word;
                    line-height: 1.4;
                `;

                const meta = document.createElement("div");
                meta.textContent = `id: ${p.id.substring(0, 12)}…`;
                meta.style.cssText = "font-size: 11px; color: #555; margin-top: 4px;";

                textDiv.appendChild(preview);
                textDiv.appendChild(meta);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.style.cssText = `
                    background: #8b2020;
                    border: none;
                    border-radius: 4px;
                    color: #fff;
                    cursor: pointer;
                    padding: 5px 12px;
                    font-size: 12px;
                    flex-shrink: 0;
                    transition: background 0.15s;
                `;
                deleteBtn.onmouseover = () => deleteBtn.style.background = "#c0392b";
                deleteBtn.onmouseout  = () => deleteBtn.style.background = "#8b2020";

                deleteBtn.onclick = async () => {
                    deleteBtn.disabled = true;
                    deleteBtn.textContent = "…";

                    try {
                        await fetch("/prompt_manager/delete", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: p.id })
                        });

                        item.remove();

                        if (list.children.length === 0) {
                            const empty = document.createElement("div");
                            empty.textContent = "No prompts saved.";
                            empty.style.cssText = "color: #666; text-align: center; padding: 24px;";
                            list.appendChild(empty);
                        }

                    } catch (err) {
                        console.error("Error deleting prompt:", err);
                        deleteBtn.disabled = false;
                        deleteBtn.textContent = "Delete";
                    }
                };

                item.appendChild(textDiv);
                item.appendChild(deleteBtn);
                return item;
            }

            // Fetch and render prompts
            fetch("/prompt_manager/list")
                .then(r => r.json())
                .then(prompts => {
                    list.innerHTML = "";

                    if (prompts.length === 0) {
                        const empty = document.createElement("div");
                        empty.textContent = "No prompts saved.";
                        empty.style.cssText = "color: #666; text-align: center; padding: 24px;";
                        list.appendChild(empty);
                        return;
                    }

                    for (const p of prompts) {
                        list.appendChild(renderItem(p));
                    }
                })
                .catch(() => {
                    list.innerHTML = "";
                    const err = document.createElement("div");
                    err.textContent = "Failed to load prompts.";
                    err.style.cssText = "color: #e74c3c; text-align: center; padding: 24px;";
                    list.appendChild(err);
                });
        }

        // Add button to the node
        node.addWidget("button", "Manage Prompts", null, openPromptManager);
    }
});
