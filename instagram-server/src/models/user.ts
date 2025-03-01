import mongoose, { Types } from "mongoose";

export interface User {
    _id?: string;
    password?: string;
    username?: string;
    firstName: string;
    lastName?: string;
    profilePicture?: string;
    email: string;
    refreshToken?: string[];
    likedPosts?: string[];
}

const userSchema = new mongoose.Schema<User>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false
    },
    profilePicture: {
      type: String,
      required: false
  },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String
    },
    likedPosts: {
      type: [Types.ObjectId],
      ref: "Post",
      required: false,
      default: [],
    },
    refreshToken: {
      type: [String],
      default: [],
    },
  });

  export const userModel = mongoose.model<User>("Users", userSchema);

