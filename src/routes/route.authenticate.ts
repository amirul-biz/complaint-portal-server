import express from "express";
import {
  controllerLogin,
  controllerGetNewJWTToken,
  controllerLogout,
} from "../controllers/controller.authenticate.js";
import { baseURL } from "../contants/constant.baseUrl.js";

const routerAuthenticate = express.Router();

routerAuthenticate.post(`${baseURL}/auth/login`, controllerLogin);
routerAuthenticate.get(`${baseURL}/refresh-token`, controllerGetNewJWTToken);
routerAuthenticate.delete(`${baseURL}/logout`, controllerLogout);

export default routerAuthenticate;
