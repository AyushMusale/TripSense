import User from "./Trips.js";

export async function addTrip(userEmail, tripData) {
  let user = await User.findOne({ email: userEmail });

  if (!user) {
    user = new User({ email: userEmail, Trips: [tripData] });
  } else {
    user.Trips.push(tripData);
  }

  await user.save();
  return user;
}