import express from "express";
import authRoutes from "./src/routes/auth.routes.js";   
import postRoutes from "./src/routes/post.routes.js";
import groupRoutes from "./src/routes/group.routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import {createGroup} from "./src/controllers/groups/createGroup.js";
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());   
app.use(bodyParser.json());


app.use("/auth", authRoutes);
app.use("/group", groupRoutes);
app.use("/post", postRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
