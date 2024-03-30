import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email, password } = await req.json();
        const user = await User.findOne({ email })

        if (bcrypt.compareSync(password, user.password)) {
            console.log("User password matched")

            // Generate JWT token with user information
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                expiresIn: '30d', // Token expiration (e.g., 30 days)
            });

            return NextResponse.json({ user, token, message: "success" }, { status: 201 })
        }
        else {
            return NextResponse.json(
                { message: "An error occurred while registering the user." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.log(error)
    }
}