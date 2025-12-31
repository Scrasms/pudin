import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Connect to postgres using a pool
const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
});

export default pool;
