import { PriorityEnum } from "../contants/constant.priority.enum.js";
import { StatusEnum } from "../contants/contant.status.enum.js";

// Complain response
export interface IGetComplaintResponse {
  id: string;
  customerName: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  priority: string;
  status: string;
}

// get complaint by id Complain response
export interface IGetComplaintByIdResponse {
  id: string;
  customerName: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  priorityId: string;
  statusId: string;
}

// Get paginated complain
export interface IGetPaginatedComplaintRequest {
  userId: string;
  pageNumber: number;
  pageSize: number;
  search?: string;
  statusId?: string;
}

export interface IGetPaginatedComplaintResponse {
  items: IGetComplaintResponse[];
  totalPageCount: number;
  pageNumber: number;
  pageSize: number;
  totalComplaintsCount: number;
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
}
