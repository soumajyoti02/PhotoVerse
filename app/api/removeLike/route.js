import { connectMongoDB } from "@/lib/mongodb";
import LikedImage from "@/models/likedImage";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();

        const { email, url } = await req.json();

        // Find all images liked by the specified email
        const userImages = await LikedImage.findOneAndUpdate(
            { likedBy: email, url },
            {
                $pull: { likedBy: email },
                $inc: { likes: -1 }
            },
            { new: true } // Will return the updated User
        );

        return NextResponse.json({ message: "success" }, { status: 200 });

    } catch (error) {
        console.error("Error during image like:", error);
        return NextResponse.json({ message: "An error occurred while processing the request" }, { status: 500 });
    }
}
