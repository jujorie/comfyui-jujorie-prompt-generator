import { app } from "../../scripts/app.js";

// Clases de nodos condicionales que este extension maneja
const CONDITIONAL_NODE_CLASSES = ["ConditionalPass", "ConditionalPassImage"];

// Colores cuando el flujo está habilitado (enabled = true)
const COLOR_ENABLED = "#2f8f2f";
const BGCOLOR_ENABLED = "#1f5f1f";

// Colores cuando el flujo está bloqueado (enabled = false)
const COLOR_BLOCKED = "#8f2f2f";
const BGCOLOR_BLOCKED = "#5f1f1f";

app.registerExtension({
    name: "conditional_pass_color",

    nodeCreated(node) {
        // Solo aplicar a los nodos condicionales
        if (!CONDITIONAL_NODE_CLASSES.includes(node.comfyClass)) return;

        const updateColor = () => {
            const widget = node.widgets?.find(w => w.name === "enabled");
            if (!widget) return;

            const enabled = widget.value === true;

            if (enabled) {
                // Verde cuando el flujo está habilitado ✓
                node.color = COLOR_ENABLED;
                node.bgcolor = BGCOLOR_ENABLED;
            } else {
                // Rojo cuando está bloqueando el workflow ❌
                node.color = COLOR_BLOCKED;
                node.bgcolor = BGCOLOR_BLOCKED;
            }

            node.setDirtyCanvas(true, true);
        };

        // Detectar cambios del boolean
        const widget = node.widgets?.find(w => w.name === "enabled");
        if (widget) {
            const originalCallback = widget.callback;
            widget.callback = function () {
                if (originalCallback) originalCallback.apply(this, arguments);
                updateColor();
            };
        }

        // Aplicar color inicial
        setTimeout(updateColor, 0);
    }
});
