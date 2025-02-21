import mongoose, { Types } from "mongoose";
import { User } from "./user";

export interface Post {
    photo: string;
    title: string;
    uploadedBy: User;
    description: string;
    uploadedAt: Date;
}

const postSchema = new mongoose.Schema<Post>({
    photo: String,
    title: String,
    uploadedBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: String,
    uploadedAt: {
        type: Date,
        default: Date.now()
    },
});

export const postModel = mongoose.model<Post>("Posts", postSchema);

