import { connectMongoDB } from "@/lib/mongodb";
import LikedImage from "@/models/likedImage";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectMongoDB();
        const allImages = await LikedImage.find({ likes: { $gte: 1 } }).sort({ likes: -1 });
        return NextResponse.json({ allImages, message: "success" }, { status: 200 });

    } catch (error) {
        console.error("Error during image like:", error);
        return NextResponse.json({ message: "An error occurred while processing the request" }, { status: 500 });
    }
}
