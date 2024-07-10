import express from "express";
import authRoutes from "./src/routes/auth.routes.js";   
import postRoutes from "./src/routes/post.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import programPostsRoutes from "./src/routes/programpost.routes.js";
import likeDislikeRoutes from "./src/routes/likeDislike.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import pipelineRoutes from "./src/routes/pipeline.routes.js";
import collectionRoutes from "./src/routes/collection.routes.js";
 import executionRoutes from "./src/routes/execution.routes.js";
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
app.use("/programPost", programPostsRoutes);
app.use("/like", likeDislikeRoutes);
app.use('/comment', commentRoutes);
app.use('/pipeline', pipelineRoutes);
app.use('/collection', collectionRoutes);
app.use('/execution', executionRoutes);










app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
