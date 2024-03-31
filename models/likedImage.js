import mongoose, { Schema } from "mongoose";

const likedImageSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        required: true,
    },
    likedBy: {
        type: [String], // Array of strings to store emails of users who liked the image
        default: [],   // Default value is an empty array
        required: true,
    },
    downloadLink: {
        type: String,
        required: false
    },
    comments: {
        type: String,
        required: false
    },
    desc: {
        type: String,
        required: false
    },
    owner: {
        type: {
            username: String,
            profile_image: String,
            instagram_username: String,
            location: String
        },
        required: false
    },

}, { timestamps: true });

const LikedImage = mongoose.models.LikedImage || mongoose.model("LikedImage", likedImageSchema);

export default LikedImage;
