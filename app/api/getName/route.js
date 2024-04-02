import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();
        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ user, message: "success" }, { status: 201 })
        }
        else {
            return NextResponse.json(
                { message: "No User Found" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.log(error)
    }
}