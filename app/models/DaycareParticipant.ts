import mongoose from "mongoose";

const DaycareParticipantSchema = new mongoose.Schema({
    _id: {type:String, required: true, unique: true},
    name: { type: String, required: true },
    age: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.DaycareParticipant || mongoose.model("DaycareParticipant", DaycareParticipantSchema);