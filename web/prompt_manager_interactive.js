import { app } from "../../scripts/app.js";

const PAGE_SIZE = 4;

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

        // Rebuild select combo with the 20 most recent prompts from the server
        async function refreshSelectOptions() {
            try {
                const response = await fetch("/prompt_manager/list?page=0&page_size=20");
                const { prompts } = await response.json();

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

        // Use a prompt: inject into the combo (if missing) and load its text
        async function usePrompt(p) {
            const option = `${p.id} | ${p.prompt.substring(0, 40).replace(/\n/g, " ")}`;

            if (!selectWidget.options.values.includes(option)) {
                selectWidget.options.values = [
                    ...selectWidget.options.values.filter(v => v !== "none"),
                    option,
                    "none"
                ].sort((a, b) => a === "none" ? 1 : b === "none" ? -1 : 0);
            }

            selectWidget.value = option;
            promptWidget.value = p.prompt;
            node.setDirtyCanvas(true, true);
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
            `;
            closeBtn.onmouseover = () => closeBtn.style.color = "#fff";
            closeBtn.onmouseout  = () => closeBtn.style.color = "#888";
            closeBtn.onclick = () => close();

            header.appendChild(title);
            header.appendChild(closeBtn);

            // List area
            const list = document.createElement("div");
            list.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-height: 80px;
            `;

            // Pagination bar
            const pager = document.createElement("div");
            pager.style.cssText = `
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 12px;
                border-top: 1px solid #333;
                padding-top: 12px;
            `;

            const btnStyle = `
                background: #2a2a3e;
                border: 1px solid #444;
                border-radius: 5px;
                color: #ccc;
                cursor: pointer;
                padding: 4px 14px;
                font-size: 14px;
            `;

            const prevBtn = document.createElement("button");
            prevBtn.textContent = "←";
            prevBtn.style.cssText = btnStyle;

            const pageLabel = document.createElement("span");
            pageLabel.style.cssText = "font-size: 12px; color: #888; min-width: 70px; text-align: center;";

            const nextBtn = document.createElement("button");
            nextBtn.textContent = "→";
            nextBtn.style.cssText = btnStyle;

            pager.appendChild(prevBtn);
            pager.appendChild(pageLabel);
            pager.appendChild(nextBtn);

            dialog.appendChild(header);
            dialog.appendChild(list);
            dialog.appendChild(pager);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            function close() {
                document.body.removeChild(overlay);
                refreshSelectOptions();
            }

            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) close();
            });

            // Pagination state
            let currentPage = 0;
            let totalItems  = 0;

            function totalPages() {
                return Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
            }

            function loadPage(page) {
                currentPage = page;
                list.innerHTML = "";

                const loading = document.createElement("div");
                loading.textContent = "Loading…";
                loading.style.cssText = "color: #777; text-align: center; padding: 24px;";
                list.appendChild(loading);

                prevBtn.disabled = true;
                nextBtn.disabled = true;

                fetch(`/prompt_manager/list?page=${page}&page_size=${PAGE_SIZE}`)
                    .then(r => r.json())
                    .then(({ prompts, total }) => {
                        totalItems = total;
                        list.innerHTML = "";

                        if (prompts.length === 0) {
                            const empty = document.createElement("div");
                            empty.textContent = "No prompts saved.";
                            empty.style.cssText = "color: #666; text-align: center; padding: 24px;";
                            list.appendChild(empty);
                        } else {
                            for (const p of prompts) {
                                list.appendChild(renderItem(p));
                            }
                        }

                        const tp = totalPages();
                        pageLabel.textContent = `${currentPage + 1} / ${tp}`;
                        prevBtn.disabled = currentPage === 0;
                        nextBtn.disabled = currentPage >= tp - 1;
                        prevBtn.style.opacity = prevBtn.disabled ? "0.3" : "1";
                        nextBtn.style.opacity = nextBtn.disabled ? "0.3" : "1";
                    })
                    .catch(() => {
                        list.innerHTML = "";
                        const err = document.createElement("div");
                        err.textContent = "Failed to load prompts.";
                        err.style.cssText = "color: #e74c3c; text-align: center; padding: 24px;";
                        list.appendChild(err);
                    });
            }

            prevBtn.onclick = () => loadPage(currentPage - 1);
            nextBtn.onclick = () => loadPage(currentPage + 1);

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
                    gap: 8px;
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

                // Action buttons
                const actions = document.createElement("div");
                actions.style.cssText = "display: flex; flex-direction: column; gap: 5px; flex-shrink: 0;";

                const useBtn = document.createElement("button");
                useBtn.textContent = "Usar";
                useBtn.style.cssText = `
                    background: #1a5c38;
                    border: none;
                    border-radius: 4px;
                    color: #fff;
                    cursor: pointer;
                    padding: 5px 12px;
                    font-size: 12px;
                `;
                useBtn.onmouseover = () => useBtn.style.background = "#27ae60";
                useBtn.onmouseout  = () => useBtn.style.background = "#1a5c38";
                useBtn.onclick = async () => {
                    await usePrompt(p);
                    close();
                };

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Borrar";
                deleteBtn.style.cssText = `
                    background: #8b2020;
                    border: none;
                    border-radius: 4px;
                    color: #fff;
                    cursor: pointer;
                    padding: 5px 12px;
                    font-size: 12px;
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

                        totalItems--;

                        // If this was the last item on the page, go to previous page
                        const remainingOnPage = list.children.length - 1;
                        const targetPage = remainingOnPage === 0 && currentPage > 0
                            ? currentPage - 1
                            : currentPage;

                        loadPage(targetPage);

                    } catch (err) {
                        console.error("Error deleting prompt:", err);
                        deleteBtn.disabled = false;
                        deleteBtn.textContent = "Borrar";
                    }
                };

                actions.appendChild(useBtn);
                actions.appendChild(deleteBtn);
                item.appendChild(textDiv);
                item.appendChild(actions);
                return item;
            }

            // Initial load
            loadPage(0);
        }

        // Add button to the node
        node.addWidget("button", "Manage Prompts", null, openPromptManager);
    }
});
