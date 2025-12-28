import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import supabase from './src/models/db.js'

// Load environment variables
dotenv.config();

const app = express();

// Constants
const IP = process.env.IP || 'localhost'
const PORT = process.env.PORT || 3000;
const GREEN = '\x1b[32m';
const WHITE = '\x1b[37m';

// Middleware
// TODO: Allow all origins for now
app.use(cors());
app.use(morgan('dev'));
app.use(express.json())

// app.get('/', (req, res) => {
//     res.json({message: 'Hello World!'});
// });

// app.get('/:name', (req, res) => {
//     res.json({message: `Hello ${req.params.name}!`});
// });

// app.post('/signup', async (req, res) => {
//     const { email, password } = req.body

//     const { data, error } = await supabase.auth.signUp({email, password});
//     if (error) {
//         res.status(error.status);
//         res.json({ code: error.code });
//     } else {
//         res.json({ code: 'success!' });
//     }
// });

app.listen(PORT, IP, () => {
    console.log(GREEN + `Server started at http://${IP}:${PORT}` + WHITE);
});