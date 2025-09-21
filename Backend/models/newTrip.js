import {User } from "./trips.js";

async function addTrip(useremail,tripData) {
    let user = await User.findOne({email:useremail});


    if(!user) {
        user = new User ({
           email:useremail,
           Trips:[tripData]
        });
    }
    else{
        user.Trips.push(tripData)
    }
    await user.save();
    console.log("Trip saved successfully");
    
    }