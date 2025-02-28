import mongoose from "mongoose";

export interface User {
    _id?: string;
    password: string;
    username: string;
    firstName: string;
    lastName?: string;
    email: string;
    refreshToken?: string[];
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
        required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: [String],
      default: [],
    },
  });

  export const userModel = mongoose.model<User>("Users", userSchema);

