import { PrismaClient } from "@prisma/client";
import { IPriority, IStatus } from "../interfaces/interface.meta.js";

const prisma = new PrismaClient();

export async function modelGetAllPriorities(): Promise<IPriority[]> {
  return prisma.priority.findMany({
    select: { id: true, name: true },
  });
}

export async function modelGetAllStatuses(): Promise<IStatus[]> {
  return prisma.status.findMany({
    select: { id: true, name: true },
  });
}
