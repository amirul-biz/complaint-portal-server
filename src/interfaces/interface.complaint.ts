import { PriorityEnum } from "../contants/constant.priority.enum.js";
import { StatusEnum } from "../contants/contant.status.enum.js";

// Complain response
export interface IGetComplaintResponse {
  id: string;
  user: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  priorityName: string;
  priorityStatus: string;
}

// Get paginated complain
export interface IGetPaginatedComplaintRequest {
  pageNumber: number;
  pageSize: number;
  search?: string;
  statusId?: string;
}

export interface IGetPaginatedComplaintResponse {
  complaints: IGetComplaintResponse[];
  totalPageCount: number;
}

// Create complain
export interface ICreateComplaintRequest {
  title: string;
  description: string;
  userId: string;
  statusId: StatusEnum;
  priorityId: PriorityEnum;
}

// UpdateComplain
export interface IUpdateComplaintRequest {
  id: string;
  statusId: string;
  priorityId: string;
}
