import express from "express"
import User from "./models/Trips.js";

const router = express.Router();

router.get("/myTrips/:email", async (req,res) =>{
    try{
        const {email} = req.params.email;
        const user =await User.findOne({email},{Trips});

        if(!user){
            return res.status(404).json({
                myTrips:[],
            message:"User not found"})
        };
        res.status(200).json({
            myTrips:user.Trips,
            errmsg:""
        })
    }catch(err){
        console.error(err);
        res.status(500).json({myTrips:[],
            message:"server error"})
}
});

export default router