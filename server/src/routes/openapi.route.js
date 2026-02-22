import { Router } from "express";
import { getOpenApi } from "../open-api.js";

export function openapiRoute() {
  const router = Router();

  const openapi = getOpenApi();

  router.get("/", (req, res) => {
    res.json(openapi);
  });

  return router;
}
