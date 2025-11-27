import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js';
import userRoute from './routes/userRoutes.js'
dotenv.config()

const app=express();
const PORT=process.env.PORT ||3000


//default middleware
app.use(express.json());

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

//user route
app.use('/api/v1/user/auth',userRoute)

connectDb()
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})