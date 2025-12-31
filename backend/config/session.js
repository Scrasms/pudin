import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config();

// Setup express-session to store sessions in postgres
const pgSession = connectPgSimple(session);
const sessionStore = new pgSession({
    pool: pool,
    tableName: "session",
});

const sessionMiddleware = session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 }, // 3 days
});

export default sessionMiddleware;
