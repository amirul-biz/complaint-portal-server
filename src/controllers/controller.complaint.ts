import { NextFunction, Request, Response } from "express";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import {
  modelCreateComplaint,
  modelGetComplaintById,
  modelGetPaginatedComplaints,
  modelUpdateComplaint,
} from "../models/model.complaint.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";
import { getDecodedJwtInfo } from "../services/service.authenticate.js";
import { PriorityEnum } from "../contants/constant.priority.enum.js";
import { StatusEnum } from "../contants/contant.status.enum.js";

export async function controllerCreateComplain(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, priorityId } = req.body;
    const refreshToken = req.cookies.refreshToken as string;
    const data = getDecodedJwtInfo(refreshToken);
    const userId = data.id;
    const statusId = StatusEnum.NEW;

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
    const userId = req.user?.id as string;
    const { id } = req.params;
    const complaint = await modelGetComplaintById(userId, id);

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
    const userId = req.user?.id as string;
    const { id } = req.params;
    const { statusId, priorityId } = req.body;

    const response = await modelUpdateComplaint(
      {
        id: id,
        statusId: statusId,
        priorityId: priorityId,
      },
      userId
    );

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
    const refreshToken = req.cookies.refreshToken as string;
    const data = getDecodedJwtInfo(refreshToken);
    const userId = data.id;
    const pageNumber = Number(req.query.pageNumber ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);

    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const statusId =
      typeof req.query.statusId === "string" ? req.query.statusId : undefined;

    const result = await modelGetPaginatedComplaints({
      userId: userId,
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
