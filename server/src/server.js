import express from "express";
import cors from "cors";
import { optionsRoute, promptRoute, openapiRoute } from "./routes/index.js";

const PORT = 3005;

const app = express();
app.use(cors());

app.use("/options", optionsRoute());
app.use("/prompt", promptRoute());
app.use("/api", openapiRoute());

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    error: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "An unexpected error occurred"
  };

  if (err.parameter) {
    response.parameter = err.parameter;
  }
  if (err.value !== undefined) {
    response.value = err.value;
  }

  res.status(statusCode).json(response);
});

app.listen(PORT, () => {
  console.log("Prompt generator running on port", PORT);
});