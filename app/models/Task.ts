// models/Task.ts ✅ FIXED
import mongoose from "mongoose";
import { randomUUID } from "crypto";

const TaskSchema = new mongoose.Schema({
    
    id:{type:String,required:true},
    userId: { type: String},
    daycareParticipantIds: [{ type: String }],
    
    // ✅ Activities 1-23 (lowercase sesuai frontend mapping)
    activity1Checked: { type: Boolean, default: false },
    activity1Note: { type: String, default: "" },
    activity2Checked: { type: Boolean, default: false },
    activity2Note: { type: String, default: "" },
    activity3Checked: { type: Boolean, default: false },
    activity3Note: { type: String, default: "" },
    activity4Checked: { type: Boolean, default: false },
    activity4Note: { type: String, default: "" },
    activity5Checked: { type: Boolean, default: false },
    activity5Note: { type: String, default: "" },
    activity6Checked: { type: Boolean, default: false },
    activity6Note: { type: String, default: "" },
    activity7Checked: { type: Boolean, default: false },
    activity7Note: { type: String, default: "" },
    activity8Checked: { type: Boolean, default: false },
    activity8Note: { type: String, default: "" },
    activity9Checked: { type: Boolean, default: false },
    activity9Note: { type: String, default: "" },
    activity10Checked: { type: Boolean, default: false },
    activity10Note: { type: String, default: "" },  
    activity11Checked: { type: Boolean, default: false },

    activity11Note: { type: String, default: "" },
    activity12Checked: { type: Boolean, default: false },
    activity12Note: { type: String, default: "" },
    activity13Checked: { type: Boolean, default: false },
    activity13Note: { type: String, default: "" },
    activity14Checked: { type: Boolean, default: false },
    activity14Note: { type: String, default: "" },
    activity15Checked: { type: Boolean, default: false },
    activity15Note: { type: String, default: "" },
    activity16Checked: { type: Boolean, default: false },
    activity16Note: { type: String, default: "" },
    activity17Checked: { type: Boolean, default: false },
    activity17Note: { type: String, default: "" },
    activity18Checked: { type: Boolean, default: false },
    activity18Note: { type: String, default: "" },
    activity19Checked: { type: Boolean, default: false },
    activity19Note: { type: String, default: "" },
    activity20Checked: { type: Boolean, default: false },
    activity20Note: { type: String, default: "" },
    activity21Checked: { type: Boolean, default: false },
    activity21Note: { type: String, default: "" },
    activity22Checked: { type: Boolean, default: false },
    activity22Note: { type: String, default: "" },
    activity23Checked: { type: Boolean, default: false },
    activity23Note: { type: String, default: "" },
    
    status: { 
      type: String, 
      enum: ["not yet", "inprogress", "completed"], 
      default: "not yet" 
    },
    
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true 
});



export default mongoose.models.Task || mongoose.model("Task", TaskSchema);