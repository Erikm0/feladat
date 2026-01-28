import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import jsYaml from "js-yaml";
import { OpenApiValidator } from "express-openapi-validate";

import { sessionMiddleware } from "./config/session";
import { authRouter } from "./routes/auth.routes";
import { personRouter } from "./routes/person.routes";
import { userRouter } from "./routes/user.routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(sessionMiddleware);

const openApiPath = path.join(process.cwd(), "openapi.yaml");
const openApiDocument = jsYaml.load(fs.readFileSync(openApiPath, "utf-8")) as any;
const validator = new OpenApiValidator(openApiDocument);

app.use(validator.match({ allowNoMatch: true }));

app.use("/api/auth", authRouter);
app.use("/api/persons", personRouter);
app.use("/api/users", userRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: {
            name: err.name,
            message: err.message,
            data: err.data,
        },
    });
});

export default app;
