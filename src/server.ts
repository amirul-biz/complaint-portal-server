import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routerComplaint from "./routes/route.complaint.js";
import routerAuthenticate from "./routes/route.authenticate.js";
import { middlewareApiErrorHandler } from "./middleware/middleware.errorHandler.js";
import routerMeta from "./routes/route.meta.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", routerComplaint);
app.use("/", routerAuthenticate);
app.use("/", routerMeta);
app.use(middlewareApiErrorHandler);

app.get("/", (_req, res) => {
  res.json({ message: "Complaint Portal API is running" });
});

app.listen(3000, () => console.log("Server runnings on http://localhost:3000"));
