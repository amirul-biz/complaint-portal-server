import { Router } from "express";
import {
  controllerGetPriorities,
  controllerGetStatuses,
} from "../controllers/controller.meta.js";
import { middlewareJwtAuthenticator } from "../middleware/middleware.authenticate.jwt.js";

const routerMeta = Router();

routerMeta.get(
  "/priorities",
  middlewareJwtAuthenticator,
  controllerGetPriorities
);
routerMeta.get("/statuses", middlewareJwtAuthenticator, controllerGetStatuses);

export default routerMeta;
