import { Request, Response, NextFunction } from "express";
import {
  modelGetAllPriorities,
  modelGetAllStatuses,
} from "../models/model.meta.js";

export async function controllerGetPriorities(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const priorities = await modelGetAllPriorities();
    res.json(priorities);
  } catch (err) {
    next(err);
  }
}

export async function controllerGetStatuses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const statuses = await modelGetAllStatuses();
    res.json(statuses);
  } catch (err) {
    next(err);
  }
}
