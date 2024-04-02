import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email, password, currentpassword } = await req.json();
        const user = await User.findOne({ email })

        if (bcrypt.compareSync(currentpassword, user.password)) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true } // To return the updated document
            );

            return NextResponse.json({ user, message: "success" }, { status: 201 })
        }
        else {
            return NextResponse.json(
                { message: "An error occurred while changing password" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.log(error)
    }
}