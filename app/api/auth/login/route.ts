import { connectToDatabase } from "@/app/lib/mongodb";
import user from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        await connectToDatabase();
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
        }

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        
        return new Response(JSON.stringify({ message: "Login successful", token }), { status: 200 });
    } catch (error) {
        console.error("Error during login:", error);
        return new Response(JSON.stringify({ message: "Error during login" }), { status: 500 });
    } 
};