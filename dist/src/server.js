import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routerComplaint from "./routes/route.complaint.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", routerComplaint);
app.get("/", (_req, res) => {
    res.json({ message: "Complaint Portal API is running" });
});
app.listen(3000, () => console.log("Server running onz http://localhost:3000"));
//# sourceMappingURL=server.js.map