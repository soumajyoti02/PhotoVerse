import { connectMongoDB } from "@/lib/mongodb";
import LikedImage from "@/models/likedImage";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { url, email } = await req.json();

        // Check if the user has already liked the image
        const existingLike = await LikedImage.findOne({ url, likedBy: email });
        console.log(existingLike);

        if (!existingLike) {
            // If the user hasn't liked the image, increment the like count and add the user's email
            let image = await LikedImage.findOneAndUpdate(
                { url },
                { $addToSet: { likedBy: email }, $inc: { likes: 1 } },
                { new: true }
            );

            if (!image) {
                // If the image doesn't exist, create a new one
                image = await LikedImage.create({ url, likes: 1, likedBy: [email] });
            }

            return NextResponse.json({ image, message: "success" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Already Liked" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error during image like:", error);
        return NextResponse.json({ message: "An error occurred while processing the request" }, { status: 500 });
    }
}
