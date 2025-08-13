import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
//# sourceMappingURL=index.js.map