import { NextFunction, Request, Response } from "express";
import { ICreateComplaintRequest } from "../interface/interface.complaint.js";
import {
  modelCreateComplaint,
  modelGetComplaintById,
  modelGetPaginatedComplaints,
  modelUpdateComplaint,
} from "../models/model.complaint.js";

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

    const response = await modelCreateComplaint({
      title,
      description,
      userId,
      statusId,
      priorityId,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in controllerCreateComplain:", error);
    next(error);
  }
}

export async function controllerGetComplaintById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Complaint ID is required" });
    }

    const complaint = await modelGetComplaintById(id);

    return res.status(200).json({
      message: "Complaint fetched successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error in controllerGetComplaintById:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
}

export async function controllerUpdateComplaint(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { statusId, priorityId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Complaint ID is required" });
    }
    if (!statusId || !priorityId) {
      return res
        .status(400)
        .json({ error: "statusId and priorityId are required" });
    }

    const response = await modelUpdateComplaint({
      id: id,
      statusId: statusId,
      priorityId: priorityId,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in controllerUpdateComplaint:", error);
    next(error);
  }
}

export async function controllergetPaginatedComplaints(
  req: Request,
  res: Response
) {
  try {
    const pageNumber = Number(req.query.pageNumber ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);

    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const statusId =
      typeof req.query.statusId === "string" ? req.query.statusId : undefined;

    const result = await modelGetPaginatedComplaints({
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      search: search,
      statusId: statusId,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in controllergetPaginatedComplaints:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
    });
  }
}
