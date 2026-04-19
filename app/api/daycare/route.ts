import { connectToDatabase } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/app/lib/auth";
import Daycare from "@/app/models/DaycareParticipant";
import { debug } from "console";


export async function GET(request: Request) {
    try {
    
      
        await connectToDatabase();
        const daycare = await Daycare.find();
        if (!daycare) {
            return new Response(JSON.stringify({ message: "Daycare participant not found" }), { status: 404 });
        }   
        return new Response(JSON.stringify({ message: "Daycare participant found", daycare }), { status: 200 });
    } catch (error) {
        console.error("Error fetching daycare participant:", error);
        return new Response(JSON.stringify({ message: "Error fetching daycare participant" }), { status: 500 });
    }
};

