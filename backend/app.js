import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import sessionMiddleware from "./config/session.js";
import userRouter from "./src/routes/userRoutes.js";
import bookRouter from "./src/routes/bookRoutes.js";
import passport from "passport";
import errorHandler from "./src/middleware/errorHandler.js";
import "./config/passport.js";
import tagRouter from "./src/routes/tagRoutes.js";

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
app.use(express.json({ limit: "32mb" }));
app.use(express.urlencoded({ extended: true }));
// TODO: Delete when test.html is no longer needed
app.use(express.static("public"));

// Auth middleware
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use("/user", userRouter);
app.use("/book", bookRouter);
app.use("/book/tag", tagRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, IP, (error) => {
    if (error) throw error;
    console.log(GREEN + `Server started at http://${IP}:${PORT}` + WHITE);
});
