import express from "express";
import {
  controllerLogin,
  controllerGetNewJWTToken,
} from "../controllers/controller.authenticate.js";

const routerAuthenticate = express.Router();

routerAuthenticate.post("/login", controllerLogin);
routerAuthenticate.get("/refresh-token", controllerGetNewJWTToken);

export default routerAuthenticate;
