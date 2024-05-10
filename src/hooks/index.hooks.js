import { errorHandler, notFound } from "../middlewares/errorHandler.js";
import authRouter from "../routes/routes.index.js";
export default (app) => {
  app.use("/api/auth", authRouter);
  app.all("*", notFound);
  app.use(errorHandler);
};