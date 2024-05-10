import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import appIndex from "./src/hooks/index.hooks.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

appIndex(app);

const server = app.listen(port, () => {
  console.log(`Server Started on PORT { ${port} }`);
});

export default app;
