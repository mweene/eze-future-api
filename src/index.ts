import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { json, urlencoded } from "express";
import { checkSchema } from "express-validator";
import router from "./routes/index.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => {
  console.log(`server is listening on port: http://localhost:${port}`);
});
