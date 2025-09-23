import express from "express";
import router from "./routes/trips.routes.js";
import Responserouter from "./responses/trips.respons.js";
import mongoose from "mongoose";
import cors from "cors";

const port = 5000;

const app=express();
app.use(express.json());
mongoose.connect('mongodb+srv://Avii:12696536@cluster1.stmzoex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
    origin: ['http://localhost:5000'],
    methods:["GET","POST","PATCH","PUT","DELETE","OPTIONS"]

}))
// app.use("/", () =>{
//   console.log("get trips request");
  
  
// })

app.use("/api/TripResponse",Responserouter);
//created trip list
app.use("/api/router",router);  

app.listen(port, () =>{
    console.log(`example app is running on port http://localhost:${port}`);
    
})