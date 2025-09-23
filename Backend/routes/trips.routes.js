import express from "express";
import User from "./models/Trips.js";

const router =express.Router();

router.post("/tripcreated", async(req,res)=>{
    try{
        const{email,Date,destination,mode,id,errmsg} =req.body;

        const newTrip = {
            Date,
            destination,
            email,
            mode,
            id,
            errmsg:""
        };

        let user = await User.findOne({email});

        if(!user){
            user= new User({
                email,
                Trips:[newTrip]
            });
        }
        else{
            user.Trips.push(newTrip);
        }

        await user.save();
        res.status(200).json({message:"Trip added successfully!", Trips:user.Trips});
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
})
export default router;