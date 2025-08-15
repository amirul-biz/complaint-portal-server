import { PrismaClient } from "@prisma/client";
import {
  ICreateComplaintRequest,
  IGetComplaintResponse,
  IGetPaginatedComplaintRequest,
  IGetPaginatedComplaintResponse,
  IUpdateComplaintRequest,
} from "../interfaces/interface.complaint.js";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";

const prisma = new PrismaClient();

export async function modelCreateComplaint(
  data: ICreateComplaintRequest
): Promise<string> {
  try {
    await prisma.complaint.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
        statusId: data.statusId,
        priorityId: data.priorityId,
      },
    });

    return "Complaint created successfully";
  } catch (error) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      "Error creating complaint"
    );
  }
}

export async function modelGetComplaintById(
  id: string
): Promise<IGetComplaintResponse> {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        user: true,
        priority: true,
        status: true,
      },
    });

    if (!complaint) {
      throw new ApiErrorHelper(
        HttpStatusCodeEnum.BAD_REQUEST,
        `Complaint with ID ${id} not found`
      );
    }

    return {
      id: complaint.id,
      user: complaint.user.name,
      title: complaint.title,
      description: complaint.description,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      priorityName: complaint.priority.name,
      priorityStatus: complaint.status.name,
    } as IGetComplaintResponse;
  } catch (error) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      "Error fetching complaint by ID"
    );
  }
}

export async function modelUpdateComplaint(
  data: IUpdateComplaintRequest
): Promise<string> {
  try {
    await prisma.complaint.update({
      where: { id: data.id },
      data: {
        statusId: data.statusId,
        priorityId: data.priorityId,
      },
    });

    return "Complaint updated successfully";
  } catch (error) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      "Error updating complaint"
    );
  }
}

export async function modelGetPaginatedComplaints(
  data: IGetPaginatedComplaintRequest
): Promise<IGetPaginatedComplaintResponse> {
  try {
    const pageNumber = Number(data.pageNumber);
    const pageSize = Number(data.pageSize);
    const { search, statusId } = data;

    const skip = (pageNumber - 1) * pageSize;

    // Build filters
    const where: any = {};

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
      user: c.user.name,
      title: c.title,
      description: c.description,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      priorityName: c.priority.name,
      priorityStatus: c.status.name,
    }));

    return {
      complaints: complaints,
      totalPageCount: totalPageCount,
    } as IGetPaginatedComplaintResponse;
  } catch (error) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      "Error fetching paginated complaints"
    );
  }
}
