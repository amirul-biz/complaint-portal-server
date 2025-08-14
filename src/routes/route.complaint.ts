import express from "express";
import { controllerCreateComplain } from "../controllers/controller.complaint.js";

const routerComplaint = express.Router();

routerComplaint.post("/complaints", controllerCreateComplain);
export default routerComplaint;
