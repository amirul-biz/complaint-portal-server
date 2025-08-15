import { PrismaClient } from "@prisma/client";
import { HttpStatusCodeEnum } from "../contants/constant.http-status.enum.js";
import {
  ICreateComplaintRequest,
  IGetComplaintResponse,
  IUpdateComplaintRequest,
} from "../interfaces/interface.complaint.js";
import { ApiErrorHelper } from "../utils/utils.error-helper.js";

export const prisma = new PrismaClient();

export function validateIsCreateRequestContainsEmptyField(
  data: ICreateComplaintRequest
): void {
  const isContainsEmptyField =
    !data.title || !data.description || !data.statusId || !data.priorityId;

  if (isContainsEmptyField) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      "All fields are required"
    );
  }
}

export function validateIsUpdateRequestContainsEmptyField(
  data: IUpdateComplaintRequest
) {
  const isContainsEmptyField = !data.id || !data.priorityId || !data.statusId;

  if (isContainsEmptyField) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      "All fields are required"
    );
  }
}

export function validateIsHaveValidationError(
  data: ICreateComplaintRequest
): void {
  const isTitleValidationError = getWordCount(data.title) < 10;
  const isDescriptionValidationError = getWordCount(data.description) < 30;

  if (isTitleValidationError || isDescriptionValidationError) {
    const errorMessage = getValidationErrorMessage(
      isTitleValidationError,
      isDescriptionValidationError
    );
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      errorMessage as string
    );
  }
}

export async function validateIsExceedComplaintLimit(
  userId: string
): Promise<void> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const maxComplaintLimit = 5;

  const countComplain = await prisma.complaint.count({
    where: {
      userId: userId,
      createdAt: { gte: sevenDaysAgo },
    },
  });

  if (countComplain > maxComplaintLimit) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.TOO_MANY_REQUESTS,
      "Rate limit exceeded: max 5 complaints per customer per week"
    );
  }
}

export function validateIsComplaintNotExist(
  complaint: IGetComplaintResponse,
  complaintId: string
): void {
  if (!complaint) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      `Complaint with ID ${complaintId} not found`
    );
  }
}

export async function validateIsUserAllowedAction(
  complaintId: string,
  userId: string
): Promise<void> {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
    include: {
      user: { select: { name: true } },
      priority: { select: { name: true } },
      status: { select: { name: true } },
    },
  });
  if (complaint?.userId !== userId) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.FORBIDDEN,
      "You are not allowed to access this complaint"
    );
  }
}

export function isHighPriorityComplaint(description: string): boolean {
  const isHighPriority = description.toLowerCase().includes("urgent");
  return isHighPriority;
}

export async function getComplaintById(
  id: string
): Promise<IGetComplaintResponse | null> {
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
      priority: { select: { name: true } },
      status: { select: { name: true } },
    },
  });

  if (!complaint) return null;

  return {
    id: complaint.id,
    customerName: complaint.user.name,
    title: complaint.title,
    description: complaint.description,
    createdAt: complaint.createdAt,
    updatedAt: complaint.updatedAt,
    priority: complaint.priority.name,
    status: complaint.status.name,
  };
}

export function getValidationErrorMessage(
  isTitleLengthError: boolean,
  isDescriptionLengthError: boolean
): string | null {
  const errors: string[] = [];

  if (isTitleLengthError) {
    errors.push("minimum title must be at least 10 characters");
  }

  if (isDescriptionLengthError) {
    errors.push("minimum description must be at least 30 characters");
  }

  return errors.length > 0 ? errors.join(" and ") : null;
}

export function getWordCount(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function validateWordCounts(inputs: {
  title: string;
  description: string;
  minTitleWords: number;
  minDescriptionWords: number;
}): void {
  const { title, description, minTitleWords, minDescriptionWords } = inputs;
  const errors: string[] = [];

  if (getWordCount(title) < minTitleWords) {
    errors.push(`Title must be at least ${minTitleWords} words`);
  }

  if (getWordCount(description) < minDescriptionWords) {
    errors.push(`Description must be at least ${minDescriptionWords} words`);
  }

  if (errors.length > 0) {
    throw new ApiErrorHelper(
      HttpStatusCodeEnum.BAD_REQUEST,
      errors.join(" and ")
    );
  }
}
