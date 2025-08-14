import express from "express";
import {
  controllerLogin,
  modelRefreshToken,
} from "../controllers/controller.authenticate.js";

const routerAuthenticate = express.Router();

routerAuthenticate.post("/login", controllerLogin);
routerAuthenticate.get("/refresh-token", modelRefreshToken);

export default routerAuthenticate;
