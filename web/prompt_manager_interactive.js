import { app } from "../../scripts/app.js";

app.registerExtension({

    name: "prompt.manager.interactive",

    async nodeCreated(node) {

        if (node.comfyClass !== "PromptManagerNode") return;

        // Get the widgets
        let selectWidget = node.widgets.find(w => w.name === "select");
        const promptWidget = node.widgets.find(w => w.name === "prompt");

        if (!selectWidget || !promptWidget) return;

        // Store original callback
        const originalCallback = selectWidget.callback;

        // Override the select widget's callback
        selectWidget.callback = async (value) => {

            // Don't load if "none" is selected
            if (value === "none") {
                if (originalCallback) originalCallback.call(selectWidget, value);
                return;
            }

            // Extract prompt ID from "id | preview" format
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

            // Call original callback if exists
            if (originalCallback) originalCallback.call(selectWidget, value);
        }
    }
});
