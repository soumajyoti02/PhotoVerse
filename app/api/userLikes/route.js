import { connectMongoDB } from "@/lib/mongodb";
import LikedImage from "@/models/likedImage";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();

        // Find all images liked by the specified email
        const userImages = await LikedImage.find({ likedBy: email });
        return NextResponse.json({ userImages, message: "success" }, { status: 200 });

    } catch (error) {
        console.error("Error during image like:", error);
        return NextResponse.json({ message: "An error occurred while processing the request" }, { status: 500 });
    }
}
