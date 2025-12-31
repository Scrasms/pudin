import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./src/routes/userRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Constants
const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;
const GREEN = "\x1b[32m";
const WHITE = "\x1b[37m";

// Middleware
// TODO: Allow all origins for now, restrict to frontend later
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routers
app.use("/user", userRouter);

// TODO: Error handler

app.listen(PORT, IP, (error) => {
    if (error) throw error;
    console.log(GREEN + `Server started at http://${IP}:${PORT}` + WHITE);
});
