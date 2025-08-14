import { PrismaClient } from "@prisma/client";
import { ICreateComplaintRequest } from "../interface/interface.complaint.js";

const prisma = new PrismaClient();

export async function modelCreateComplaint(data: ICreateComplaintRequest) {
  try {
    const complaint = await prisma.complaint.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
        statusId: data.statusId,
        priorityId: data.priorityId,
      },
      include: {
        user: true,
        status: true,
        priority: true,
      },
    });

    return complaint;
  } catch (error) {
    console.error("Error creating complaint:", error);
    throw error;
  }
}
