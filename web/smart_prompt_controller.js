import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

const NODE_DISPLAY_NAME = "SmartPromptController"

app.registerExtension({
    name: "smart_prompt_controller",

    setup() {
        // Escuchar cualquier nodo que se ejecute (incluyendo PreviewAny)
        api.addEventListener("executed", async (event) => {
            // Buscar el nodo SmartPromptController en el grafo
            const nodes = app.graph._nodes || app.graph.nodes || [];
            const smartPromptNode = nodes.find(n => n?.comfyClass === NODE_DISPLAY_NAME);

            if (!smartPromptNode) return;

            const fetchWidget = smartPromptNode.widgets?.find(w => w.name === "fetch");
            const urlWidget = smartPromptNode.widgets?.find(w => w.name === "url");
            const promptWidget = smartPromptNode.widgets?.find(w => w.name === "prompt");

            if (!fetchWidget?.value) {
                console.log("[SmartPromptController] fetch=false, no fetching");
                return;
            }
            if (!urlWidget?.value) {
                console.log("[SmartPromptController] No URL configured");
                return;
            }

            try {
                console.log(`[SmartPromptController] Fetching from ${urlWidget.value}...`);
                const res = await fetch(urlWidget.value);
                
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                
                const text = await res.text();
                console.log(`[SmartPromptController] Fetched successfully. Length: ${text.length} chars`);

                // Update widget value
                if (promptWidget) {
                    promptWidget.value = text;
                    
                    // Update node's widget values array
                    const idx = smartPromptNode.widgets.findIndex(w => w.name === "prompt");
                    if (idx !== -1 && smartPromptNode.widgets_values) {
                        smartPromptNode.widgets_values[idx] = text;
                    }
                    
                    // Callback to ensure UI updates
                    if (promptWidget.callback) {
                        promptWidget.callback(text);
                    }
                }

                // Force canvas redraw to update UI
                smartPromptNode.setDirtyCanvas(true, true);
                
                // Also trigger property change event for reactivity
                if (smartPromptNode.onPropertyChanged) {
                    smartPromptNode.onPropertyChanged("prompt", text);
                }
                
            } catch (err) {
                console.error("[SmartPromptController] Prompt fetch error:", err);
            }
        });
    }
});