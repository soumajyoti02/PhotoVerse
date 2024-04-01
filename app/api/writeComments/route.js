import { connectMongoDB } from "@/lib/mongodb";
import LikedImage from "@/models/likedImage";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();

        const { url, email, userComments, name } = await req.json();
        // console.log(`url: ${url}, email: ${email}, userComments: ${userComments}`);

        // Find the image by its URL
        const likedImage = await LikedImage.findOne({ url });

        if (!likedImage) {
            return NextResponse.json({ message: "Image not found" }, { status: 404 });
        }

        // Add the user's comment to the comments array
        likedImage.comments.push({ name, username: email, comm: userComments });

        // Get all comments of the image
        const comments = likedImage.comments;
        console.log(comments);


        // Save the modified image back to the database
        await likedImage.save();

        return NextResponse.json({ comments, message: "success" }, { status: 200 });

    } catch (error) {
        console.error("Error during adding comment:", error);
        return NextResponse.json({ message: "An error occurred while processing the request" }, { status: 500 });
    }
}
