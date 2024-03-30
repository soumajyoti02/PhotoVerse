import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email, name } = await req.json();
        console.log(`name: ${name}`);
        const user = await User.findOneAndUpdate(
            { email },
            { name: name },
            { new: true } // To return the updated document
        );

        if (user) {
            console.log(`User Name Changed to ${user.name}`);
            return NextResponse.json({ user, message: "success" }, { status: 201 })
        }
        else {
            return NextResponse.json(
                { message: "An error occurred" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.log(error)
    }
}