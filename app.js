import "dotenv/config";
import express from "express";
import appSetup from "./src/utils/app.setup.js";
import appIndex from "./src/hooks/index.hooks.js";
const app = express();
const port = process.env.PORT || 3000;
appSetup(app);
appIndex(app);


const server = app.listen(port, () => {
  console.log(`Server Started on PORT { ${port} }`);
});

export default app;