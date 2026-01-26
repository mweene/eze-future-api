import express, { Application, json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./router/routes.js";

const app: Application = express();
const port = 4400;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});
