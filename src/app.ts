import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/routes.js";

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
