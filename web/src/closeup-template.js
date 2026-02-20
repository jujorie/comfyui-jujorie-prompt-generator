export function buildCloseupPrompt(d) {
  return `
${d.summary}

${d.model}

${d.location}.

${d.pose}.

${d.camera}.

${d.lighting}.

${d.finishes}.
`.trim();
}
