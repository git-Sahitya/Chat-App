import dotenv from "dotenv";
import express from "express"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app,server} from  "./lib/socket.js"
 
dotenv.config();

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ limit:"10mb" ,extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT} `);
  connectDB();
});
