import {Router} from "express"
import { dataSets } from "../data-loader.js";

export function optionsRoute() {

    const router = Router();

    router.get("/", (req, res) => {
      res.json(dataSets);
    });

    return router
}
