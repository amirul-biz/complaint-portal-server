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
  `/complaints-listing`,
  middlewareJwtAuthenticator,
  controllergetPaginatedComplaints
);
routerComplaint.get(
  `/complaints/:id`,
  middlewareJwtAuthenticator,
  controllerGetComplaintById
);
routerComplaint.patch(
  `/complaints/:id`,
  middlewareJwtAuthenticator,
  controllerUpdateComplaint
);

export default routerComplaint;
