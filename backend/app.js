import express from "express";
import authRoutes from "./src/routes/auth.routes.js";   
import postRoutes from "./src/routes/post.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import cors from "cors";
import bodyParser from "body-parser";
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());   
app.use(bodyParser.json()); 

app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/profile", profileRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
