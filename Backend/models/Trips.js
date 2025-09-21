import mongoose, { Schema } from "mongoose";

const tripsSchema =new mongoose.Schema 
({
    "Trips":{
        Date: {
            type:Date,
            require:true,
        },
        destination:{
            type:String,
            require:true,
        },
        email:{
            type:String,
            require:true
        },
        Mode: {
            type:String,
            require:true,
        },
        id:{
            type:String,
            require:true
        },
        errmsg:" "
    }
})
const userSchema = mongoose.Schema({
    email:{
        type:String,require:true,unique:true
    },
    Trips:[tripsSchema]
});

const User = mongoose.models("user",tripsSchema);

export default User;