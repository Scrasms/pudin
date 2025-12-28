import postgres from 'postgres'
import dotenv from 'dotenv';
dotenv.config();

// TODO: Add DATABASE_URL to .env (probs localhost and random port for now)
const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

export default sql