import "express-async-errors";
import express from "express";

import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { userRoute } from "./routes/user.route";

import { handleError } from "./error";
import { postRoute } from "./routes/post.route";
import { adminRoute } from "./routes/admin.route";
import { commentRoute } from "./routes/comment.route";
import { historyRoute } from "./routes/history.route";
import { astronomerRoute } from "./routes/astronomer.route";

export const db = new PrismaClient();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/admin", adminRoute);
app.use("/comment", commentRoute);
app.use("/history", historyRoute);
app.use("/astronomer", astronomerRoute);

app.use(handleError);

export default app;
