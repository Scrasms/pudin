import Router from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.json({message: 'Hello World!'});
});

// userRouter.get('/:name', (req, res) => {
//     res.json({message: `Hello ${req.params.name}!`});
// });

// userRouter.post('/signup', async (req, res) => {
//     const { email, password } = req.body

//     const { data, error } = await supabase.auth.signUp({email, password});
//     if (error) {
//         res.status(error.status);
//         res.json({ code: error.code });
//     } else {
//         res.json({ code: 'success!' });
//     }
// });

export default userRouter;