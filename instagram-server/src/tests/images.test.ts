import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Images API Tests", () => {
  test("Should return 400 if no image path is provided", async () => {
    const response = await request(app)
      .get("/image")

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Image path is required");
  });

  test("Should return 404 if the image does not exist", async () => {
    const response = await request(app)
      .get("/image?path=nonexistent.jpg")

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Image not found");
  });

});
