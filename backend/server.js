import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

const app = express();

// Constants
const IP = process.env.IP
const PORT = process.env.PORT;
const GREEN = '\x1b[32m';
const WHITE = '\x1b[37m';

// Middleware
// TODO: Allow all origins for now
app.use(cors());
app.use(morgan('dev'));

// app.get('/', (req, res) => {
//     res.json({message: 'Hello World!'});
// });

// app.get('/:name', (req, res) => {
//     res.json({message: `Hello ${req.params.name}!`});
// });

app.listen(PORT, IP, () => {
    console.log(GREEN + `Server started at http://${IP}:${PORT}` + WHITE);
});