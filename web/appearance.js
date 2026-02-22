import { app } from "/scripts/app.js";

const COLOR_THEMES = {
    prompt: {
        nodeBgColor: "#3B5436",
        nodeColor: "#263324",
        width: 340
    },
};

const NODE_COLORS = {
    "SmartPromptController": "prompt",
    "FetchPromptFromURL": "prompt",
    "PromptURLBuilder": "prompt"
};

function setNodeColors(node, theme) {
    if (!theme) {
        return;
    }

    if (theme.nodeColor) {
        node.color = theme.nodeColor;
    }

    if (theme.nodeBgColor) {
        node.bgcolor = theme.nodeBgColor;
    }

    if (theme.width) {
        node.size = node.size || [140, 80];
        node.size[0] = theme.width;
    }
}

const ext = {
    name: "smart_prompt_controller_appearance",

    nodeCreated(node) {
        const nodeClass = node.comfyClass;
        if (NODE_COLORS.hasOwnProperty(nodeClass)) {
            let colorKey = NODE_COLORS[nodeClass];
            const theme = COLOR_THEMES[colorKey];
            setNodeColors(node, theme);
        }
    }
};

app.registerExtension(ext);