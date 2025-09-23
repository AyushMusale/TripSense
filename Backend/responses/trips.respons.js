import express from "express";
import User from "../models/Trips.js";

const Responserouter = express.Router();

// Get trips by user email per required.md
Responserouter.get("/trips/:email", async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ myTrips: [], errormsg: "email is required" });
    }

    const user = await User.findOne({ email }, { Trips: 1, _id: 0 });
    if (!user) {
      return res.status(200).json({ myTrips: [], errormsg: "" });
    }

    return res.status(200).json({ myTrips: user.Trips || [], errormsg: "" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ myTrips: [], errormsg: "Unable to fetch trips: server error" });
  }
});

export default Responserouter;