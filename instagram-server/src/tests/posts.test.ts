import request from "supertest";
import {initApp} from "../server";
import mongoose from "mongoose";
import {postModel} from "../models/post";
import { Express } from "express";
import {userModel, User } from "../models/user";

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

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();

  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = res.body.accessToken;
  testUser._id = res.body._id;
  expect(testUser.accessToken).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let postId = "";
describe("Posts Tests", () => {
  test("Posts test get all", async () => {
    const response = await request(app).get("/post")
          .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Post", async () => {
    const response = await request(app).post("/post")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        title: "Test title",
        description: "Test description",
        uploadedBy: testUser,
        photo:"",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test title");
    expect(response.body.description).toBe("Test description");
    postId = response.body._id;
  });

  test("Test get post by uploader", async () => {
    const response = await request(app).get("/post?uploader=" + testUser._id)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test title");
    expect(response.body[0].description).toBe("Test description");
  });

  test("Test get post by id", async () => {
    const response = await request(app).get("/post/" + postId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test title");
    expect(response.body.description).toBe("Test description");
  });

  test("Test Create Post 2", async () => {
    const response = await request(app).post("/post")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        title: "Test Post 2",
        description: "Test Content 2",
        uploadedBy: testUser,
      });
    expect(response.statusCode).toBe(201);
  });

  test("Posts test get all 2", async () => {
    const response = await request(app).get("/post")
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Delete Post", async () => {
    const response = await request(app).delete("/post/" + postId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).get("/post/" + postId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response2.statusCode).toBe(404);
  });

  test("Test Create Post fail", async () => {
    const response = await request(app).post("/post")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        description: "Test description again",
      });
    expect(response.statusCode).toBe(400);
  });
});