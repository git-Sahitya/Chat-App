import express from "express"
import dotenv from "dotenv"
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
const app = express()
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const PORT = process.env.PORT 

app.use('/api/auth' , authRoutes)
app.use('/api/message' , messageRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT} `);
    connectDB()
    
})