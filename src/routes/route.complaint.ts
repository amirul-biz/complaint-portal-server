import express from "express";
import {
  controllerCreateComplain,
  controllerGetComplaintById,
  controllerUpdateComplaint,
  controllergetPaginatedComplaints,
} from "../controllers/controller.complaint.js";

const routerComplaint = express.Router();

routerComplaint.post("/complaints", controllerCreateComplain);
routerComplaint.get("/complaints", controllergetPaginatedComplaints);
routerComplaint.get("/complaints/:id", controllerGetComplaintById);
routerComplaint.patch("/complaints/:id", controllerUpdateComplaint);

export default routerComplaint;
