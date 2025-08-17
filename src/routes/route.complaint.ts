import express from "express";
import {
  controllerCreateComplain,
  controllerGetComplaintById,
  controllerUpdateComplaint,
  controllergetPaginatedComplaints,
} from "../controllers/controller.complaint.js";
import { middlewareJwtAuthenticator } from "../middleware/middleware.authenticate.jwt.js";
import { baseURL } from "../contants/constant.baseUrl.js";

const routerComplaint = express.Router();

routerComplaint.post(
  "/complaints",
  middlewareJwtAuthenticator,
  controllerCreateComplain
);
routerComplaint.get(
  `${baseURL}/complaints-listing`,
  middlewareJwtAuthenticator,
  controllergetPaginatedComplaints
);
routerComplaint.get(
  `${baseURL}/complaints/:id`,
  middlewareJwtAuthenticator,
  controllerGetComplaintById
);
routerComplaint.patch(
  `${baseURL}/complaints/:id`,
  middlewareJwtAuthenticator,
  controllerUpdateComplaint
);

export default routerComplaint;
