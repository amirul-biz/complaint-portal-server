import { NextFunction, Request, Response } from "express";
import { ICreateComplaintRequest } from "../interfaces/interface.complaint.js";
import {
  modelCreateComplaint,
  modelGetComplaintById,
  modelGetPaginatedComplaints,
  modelUpdateComplaint,
} from "../models/model.complaint.js";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";

export async function controllerCreateComplain(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, userId, statusId, priorityId } =
      req.body as ICreateComplaintRequest;

    if (!title || !description || !userId || !statusId || !priorityId) {
      throw new ApiErrorHelper(
        HttpStatusCodeEnum.BAD_REQUEST,
        "All fields are required"
      );
    }

    const response = await modelCreateComplaint({
      title,
      description,
      userId,
      statusId,
      priorityId,
    });

    return res.status(HttpStatusCodeEnum.OK).json(response);
  } catch (error) {
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
      throw new ApiErrorHelper(
        HttpStatusCodeEnum.BAD_REQUEST,
        "Complaint ID is required"
      );
    }

    const complaint = await modelGetComplaintById(id);

    return res.status(HttpStatusCodeEnum.OK).json({
      message: "Complaint fetched successfully",
      complaint,
    });
  } catch (error) {
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
      throw new ApiErrorHelper(
        HttpStatusCodeEnum.BAD_REQUEST,
        "Complaint ID is required"
      );
    }

    if (!statusId || !priorityId) {
      throw new ApiErrorHelper(
        HttpStatusCodeEnum.BAD_REQUEST,
        "statusId and priorityId are required"
      );
    }

    const response = await modelUpdateComplaint({
      id: id,
      statusId: statusId,
      priorityId: priorityId,
    });

    return res.status(HttpStatusCodeEnum.OK).json(response);
  } catch (error) {
    next(error);
  }
}

export async function controllergetPaginatedComplaints(
  req: Request,
  res: Response,
  next: NextFunction
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

    res.status(HttpStatusCodeEnum.OK).json(result);
  } catch (error) {
    next(error);
  }
}
