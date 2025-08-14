import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function modelCreateComplaint(data) {
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
    }
    catch (error) {
        console.error("Error creating complaint:", error);
        throw error;
    }
}
//# sourceMappingURL=model.complaint.js.map