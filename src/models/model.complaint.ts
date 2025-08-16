import { PrismaClient } from "@prisma/client";
import {
  ICreateComplaintRequest,
  IGetComplaintResponse,
  IGetPaginatedComplaintRequest,
  IGetPaginatedComplaintResponse,
  IUpdateComplaintRequest,
} from "../interfaces/interface.complaint.js";
import {
  getComplaintById,
  isHighPriorityComplaint,
  validateIsComplaintNotExist,
  validateIsCreateRequestContainsEmptyField,
  validateIsExceedComplaintLimit,
  validateIsHaveValidationError,
  validateIsUpdateRequestContainsEmptyField,
  validateIsUserAllowedAction,
} from "../services/service.complaints.js";
import { PriorityEnum } from "../contants/constant.priority.enum.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";

const prisma = new PrismaClient();

export async function modelCreateComplaint(
  data: ICreateComplaintRequest
): Promise<{ complaint: IGetComplaintResponse }> {
  validateIsCreateRequestContainsEmptyField(data);
  validateIsHaveValidationError(data);
  await validateIsExceedComplaintLimit(data.userId);
  const priorityId = isHighPriorityComplaint(data.description)
    ? PriorityEnum.HIGH
    : data.priorityId;

  const complaint = await prisma.complaint.create({
    data: {
      title: data.title,
      description: data.description,
      userId: data.userId,
      statusId: data.statusId,
      priorityId: priorityId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      status: {
        select: {
          name: true,
        },
      },
      priority: {
        select: {
          name: true,
        },
      },
    },
  });

  const response: IGetComplaintResponse = {
    id: complaint.id,
    customerName: complaint.user.name,
    title: complaint.title,
    description: complaint.description,
    createdAt: complaint.createdAt,
    updatedAt: complaint.updatedAt,
    priority: complaint.priority.name,
    status: complaint.status.name,
  };

  return { complaint: response };
}

export async function modelGetComplaintById(
  userId: string,
  id: string
): Promise<IGetComplaintResponse> {
  if (!id) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      "Complaint ID is required"
    );
  }

  const complaint = (await getComplaintById(id)) as IGetComplaintResponse;
  validateIsComplaintNotExist(complaint, id);
  await validateIsUserAllowedAction(id, userId);

  return {
    id: complaint.id,
    customerName: complaint.customerName,
    title: complaint.title,
    description: complaint.description,
    createdAt: complaint.createdAt,
    updatedAt: complaint.updatedAt,
    priority: complaint.priority,
    status: complaint.status,
  } as IGetComplaintResponse;
}

export async function modelUpdateComplaint(
  data: IUpdateComplaintRequest,
  userId: string
): Promise<{ complaint: IGetComplaintResponse }> {
  validateIsUpdateRequestContainsEmptyField(data);
  validateIsUserAllowedAction(data.id, userId);

  const complaint = await prisma.complaint.update({
    where: { id: data.id },
    data: {
      statusId: data.statusId,
      priorityId: data.priorityId,
    },
    include: {
      user: { select: { name: true } },
      status: { select: { name: true } },
      priority: { select: { name: true } },
    },
  });

  const updatedComplaint = {
    id: complaint.id,
    customerName: complaint.user.name,
    title: complaint.title,
    description: complaint.description,
    createdAt: complaint.createdAt,
    updatedAt: complaint.updatedAt,
    priority: complaint.priority.name,
    status: complaint.status.name,
  };

  return { complaint: updatedComplaint };
}

export async function modelGetPaginatedComplaints(
  data: IGetPaginatedComplaintRequest
): Promise<IGetPaginatedComplaintResponse> {
  const pageNumber = Number(data.pageNumber);
  const pageSize = Number(data.pageSize);
  const { search, statusId } = data;

  const skip = (pageNumber - 1) * pageSize;

  const where: any = {};

  where.userId = data.userId;

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (statusId) {
    where.statusId = statusId;
  }

  const totalCount = await prisma.complaint.count({ where });
  const totalPageCount = Math.ceil(totalCount / pageSize);

  const complaintsRaw = await prisma.complaint.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      priority: { select: { name: true } },
      status: { select: { name: true } },
    },
  });

  const complaints: IGetComplaintResponse[] = complaintsRaw.map((c) => ({
    id: c.id,
    customerName: c.user.name,
    title: c.title,
    description: c.description,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    priority: c.priority.name,
    status: c.status.name,
  }));

  return {
    complaints: complaints,
    totalPageCount: totalPageCount,
    totalComplaintsCount: totalCount,
    pageNumber: pageNumber,
    pageSize: pageSize,
  } as IGetPaginatedComplaintResponse;
}
