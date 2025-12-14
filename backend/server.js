import express from 'express'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})