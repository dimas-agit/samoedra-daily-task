import { randomUUID } from "crypto";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: {type:String, required: true, unique: true,default:randomUUID},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

},{ timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);