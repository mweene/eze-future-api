import express from "express";
import { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./router/clientRoutes.js";
import { nonExistentRoutes } from "./controllers/clientControllers.js";
const port = process.env.PORT || 5000;

const app = express();

//intialize middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(router);

app.use(nonExistentRoutes);

app.listen(port, () => {
  console.log(`server is listening on port: http://localhost:${port}`);
});
