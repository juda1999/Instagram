import request from "supertest";
import { User, userModel } from "../models/user";
import mongoose from "mongoose";
import { initApp } from "../server";
import { Express } from "express";


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
    await userModel.deleteMany();

    const res = await request(app).post("/auth/register").send(testUser);
    testUser.accessToken = res.body.accessToken;
    testUser._id = res.body.user._id;
    expect(testUser.accessToken).toBeDefined();
});

afterAll((done) => {
    console.log("afterAll");
    mongoose.connection.close();
    done();
});


describe("User Controller Tests", () => {
    test("should return user details when ID is valid", async () => {
        const response = await request(app)
            .get(`/user/userInfo/${testUser._id}`)
            .set({ authorization: testUser.accessToken })

        expect(response.status).toBe(200);
        expect(response.body.firstName).toEqual(testUser.firstName);
    });

    test("should return 404 when user is not found", async () => {
        const response = await request(app)
            .get(`/user/userInfo/${new mongoose.Types.ObjectId("111111111111111111111111")}`)
            .set({ authorization: testUser.accessToken })
        expect(response.status).toBe(404);
    });

    test("should update user details successfully", async () => {
        const updatedUser = { ...testUser, firstName: "Updated" };

        const response = await request(app)
            .post(`/user/update/${testUser._id}`)
            .set({ authorization: testUser.accessToken })
            .send({
                email: updatedUser.email,
                username: updatedUser.username,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
            });

        expect(response.status).toBe(200);
        expect(response.body.firstName).toBe("Updated");
    });
});
