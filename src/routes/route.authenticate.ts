import express from "express";
import {
  controllerLogin,
  controllerGetNewJWTToken,
  controllerLogout,
} from "../controllers/controller.authenticate.js";

const routerAuthenticate = express.Router();

routerAuthenticate.post(`/auth/login`, controllerLogin);
routerAuthenticate.get(`/refresh-token`, controllerGetNewJWTToken);
routerAuthenticate.delete(`/logout`, controllerLogout);

export default routerAuthenticate;
