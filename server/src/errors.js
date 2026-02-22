export class PromptServerError extends Error {
  constructor(message, statusCode, data = {}) {
    super(message);
    this.name = "PromptServerError";
    this.statusCode = statusCode;
    this.code = data.code || "INTERNAL_ERROR";
    this.parameter = data.parameter || null;
    this.value = data.value || null;
  }
}
