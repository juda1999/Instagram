import request from "supertest";
import {initApp} from "../server";
import mongoose from "mongoose";
import {Post, postModel} from "../models/post";
import { Express } from "express";
import {userModel,User } from "../models/user";

var app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

const baseUrl = "/auth";

type IUser = User & {
  accessToken?: string,
  refreshToken?: string
};

const testUser: IUser = {
  email: "test@user.com",
  password: "testpassword",
  firstName: "Test",
}

const postTest: Post = {
 title: "Test Post",
 description: "Test Content",
 photo: "",
 uploadedBy: testUser,
 uploadedAt: new Date(),
}

describe("Auth Tests", () => {
  test("Auth test register", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send({
      email: "sdsdfsd",
      password: ""
    });

    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post(baseUrl + "/register").send({
      email: "",
      password: "sdfsd",
    });

    expect(response2.statusCode).not.toBe(200);
  });

  test("Auth test login", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);

    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(response.body.user._id).toBeDefined();

    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body.user._id;
  });

  test("Check tokens are not the same", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).not.toBe(testUser.accessToken);
    expect(refreshToken).not.toBe(testUser.refreshToken);
  });

  test("Auth test login fail", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: "sdfsd",
      firstName: "sdfsd",
    });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post(baseUrl + "/login").send({
      email: "dsfasd",
      password: "sdfsd",
      firstName: "sdfsd",
    });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Auth test create post with/out token", async () => {
    const response = await request(app).post("/post").send(postTest);
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post("/post").set(
      { authorization: testUser.accessToken }
    ).send(postTest);
    expect(response2.statusCode).toBe(200);
  });

  test("Test refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  jest.setTimeout(10000);

  test("Test timeout token ", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response2 = await request(app).post("/post").set(
      { authorization: testUser.accessToken }
    ).send(postTest);
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).toBe(200);

    testUser.accessToken = response3.body.accessToken;

    const response4 = await request(app).post("/post").set(
      { authorization: testUser.accessToken }
    ).send(postTest);
    expect(response4.statusCode).toBe(200);
  });
});