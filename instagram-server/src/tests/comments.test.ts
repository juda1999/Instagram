import request from "supertest";
import {initApp} from "../server";
import mongoose from "mongoose";
import {commentModel} from "../models/comment";
import { ObjectId } from "mongoose";
import { Express } from "express";
import { User, userModel } from "../models/user";

var app: Express;

type IUser = User & {
  accessToken?: string,
  refreshToken?: string
};

const testUser: IUser = {
  email: "test@user.com",
  password: "testpassword",
  firstName: "Test",
}

const testComments = [
  {
    message: "Test Comment",
    post: new mongoose.Types.ObjectId("6766ba578512b96e0948f8f3"),
    uploadedBy: new mongoose.Types.ObjectId("6766b07ed176ee0ca0ea6105"),
    uploadedAt: new Date(),

  },
  {
    message: "Test Comment 2",
    post: new mongoose.Types.ObjectId("6766ba578512b96e0948f8f3"),
    uploadedBy: new mongoose.Types.ObjectId("6766b07ed176ee0ca0ea6105"),
    uploadedAt: new Date(),
  },
]

beforeAll(async () => {
  app = await initApp();
  await commentModel.deleteMany();
  await userModel.deleteMany();

  await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;
    testUser._id = res.body.user._id;
    expect(testUser.accessToken).toBeDefined();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

let commentId = "";

describe("Comments Tests", () => {
  test("Comments test get all", async () => {
    const response = await request(app).get("/comment")
      .set({ authorization: testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const response = await (await request(app).post("/comment")
      .set({authorization: testUser.accessToken})
      .send(testComments[0]));
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe(testComments[0].message);
    commentId = response.body._id;
  });

  test("Test get comments by uploader", async () => {
    const response = await request(app).get("/comment?uploader=" + testComments[0].uploadedBy)
      .set({ authorization: testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].message).toBe(testComments[0].message);
  });

  test("Comments get post by id", async () => {
    const response = await request(app).get("/comment/" + commentId)
      .set({ authorization: testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(testComments[0].message);
  });

  test("Test Create Comment 2", async () => {
    const response = await request(app).post("/comment")
      .set({authorization: testUser.accessToken})
      .send(testComments[1]);
    expect(response.statusCode).toBe(201);
  });

  test("Comments test get all 2", async () => {
    const response = await request(app).get("/comment")
      .set({ authorization: testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Delete Comment", async () => {
    const response = await request(app).delete("/comment/delete/" + commentId)
      .set({authorization: testUser.accessToken});
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).get("/comment/" + commentId)
      .set({authorization: testUser.accessToken});
    expect(response2.statusCode).toBe(404);
  });

  test("Test Create Comment fail", async () => {
    const response = await request(app).post("/comment")
      .send({
      message: "Test Comment",
      post: new mongoose.Types.ObjectId("6766ba578512b96e0948f8f3"),
      uploadedBy: "",
      uploadedAt: new Date(),
     });
    expect(response.statusCode).toBe(401);
  });
});