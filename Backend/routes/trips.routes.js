import express from "express";
import User from "../models/Trips.js";

const router = express.Router();

// Create a trip per required.md
router.post("/trips", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        date: null,
        destination: null,
        email: null,
        mode: null,
        id: null,
        errormsg: "email is required",
      });
    }

    const generatedTrip = {
      date: new Date().toISOString().slice(0, 10),
      destination: "",
      email,
      mode: "",
      id: `${Date.now()}`,
      errormsg: "",
    };

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, Trips: [generatedTrip] });
    } else {
      user.Trips.push(generatedTrip);
    }

    await user.save();
    return res.status(201).json(generatedTrip);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      date: null,
      destination: null,
      email: null,
      mode: null,
      id: null,
      errormsg: "Server error",
    });
  }
});

export default router;