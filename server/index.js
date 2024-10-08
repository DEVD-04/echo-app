import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactsRoutes from "./routes/ContactRoutes.js"

dotenv.config();

const app=express();
const port = process.env.PORT || 4001;
const databaseURL= process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],   //communicate between different platfors where frontend backend hosted
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    //allowed rest api methods
    credentials: true,  //enable cookies
}))

// 
app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser()); //getting cookies from frontend
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);


const server= app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});

mongoose.connect(databaseURL).then(()=> console.log("DB connection successful")).catch((err)=> console.log(err.message));