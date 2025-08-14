import { modelCreateComplaint } from "../models/model.complaint.js";
export async function controllerCreateComplain(req, res, next) {
    try {
        const { title, description, userId, statusId, priorityId } = req.body;
        if (!title || !description || !userId || !statusId || !priorityId) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const complaint = await modelCreateComplaint({
            title,
            description,
            userId,
            statusId,
            priorityId,
        });
        return res.status(201).json({
            message: "Complaint created successfully",
            complaint,
        });
    }
    catch (error) {
        console.error("Error in controllerCreateComplain:", error);
        next(error);
    }
}
//# sourceMappingURL=controller.complaint.js.map