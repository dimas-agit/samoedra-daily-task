import { connectToDatabase } from "@/app/lib/mongodb";
import user from "@/app/models/User";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";


export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        await connectToDatabase();

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = randomUUID();
        const newUser = new user({ _id: id, email, password: hashedPassword });
        await newUser.save();
        return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
    } catch (error) {  
        console.error("Error registering user:", error);
        return new Response(JSON.stringify({ message: "Error registering user" }), { status: 500 });
    }   
};
