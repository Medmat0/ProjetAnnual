import express from "express";
import authRoutes from "./backend/src/routes/auth.routes.js";   
import postRoutes from "./backend/src/routes/post.routes.js";
import groupRoutes from "./backend/src/routes/group.routes.js";
import cors from "cors";
import bodyParser from "body-parser";
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
