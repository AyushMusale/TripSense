import mongoose from "mongoose";

// Trip subdocument schema matching required.md
const TripSchema = new mongoose.Schema(
  {
    date: {
      type: String, // store as YYYY-MM-DD string as per spec
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    errormsg: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// User schema with trips array
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    Trips: { type: [TripSchema], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;