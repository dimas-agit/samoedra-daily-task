import { connectToDatabase } from "@/app/lib/mongodb";
import user from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
    try {
    const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
      
        await connectToDatabase();
        const existingUser = await user.findById(id)
        
      
        
        return new Response(JSON.stringify({ message: "User", existingUser }), { status: 200 });
    } catch (error) {
        console.error("Error during login:", error);
        return new Response(JSON.stringify({ message: "Error during login" }), { status: 500 });
    } 
};