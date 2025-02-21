import mongoose, { Types } from "mongoose";
import { Post } from "./post";
import { User } from "./user";

export interface Comment {
    message: string;
    post: Post;
    uploadedBy: User;
    uploadedAt: Date;
}

const commentSchema = new mongoose.Schema<Comment>({
    message: {
        type: String,
        required: true
    },
    post: {
        type: Types.ObjectId,
        ref: "Post",
        required: true
    },
    uploadedBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now()
    },
 })

 export const commentModel = mongoose.model<Comment>("Comment", commentSchema);
