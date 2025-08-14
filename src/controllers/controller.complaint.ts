import { Request, Response, NextFunction } from "express";
import { modelCreateComplaint } from "../models/model.complaint.js";
import { ICreateComplaintRequest } from "../interface/interface.complaint.js";

export async function controllerCreateComplain(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, userId, statusId, priorityId } =
      req.body as ICreateComplaintRequest;

    if (!title || !description || !userId || !statusId || !priorityId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const complaint = await modelCreateComplaint({
      title,
      description,
      userId,
      statusId,
      priorityId,
    });

    return res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error in controllerCreateComplain:", error);
    next(error);
  }
}
