import request from "supertest";
import { app } from "../..";

import { mongoDBClient } from "../../respositories/db";

describe("Test the bloggers", () => {
    let testUser;

    beforeAll(async () => {
        await mongoDBClient.connect();
    });

    afterAll(async () => {
        await mongoDBClient.close();
    });

    test("Users route response the GET method with status code 200", async () => {
        const result = await request(app).get("/users/");

        console.log(result.statusCode);

        expect(result.statusCode).toBe(200);
    });

    test("Users route response the GET method for not found blogger and status code 404", async () => {
        const result = await request(app).get("/users/1");

        expect(result.statusCode).toBe(404);
    });

    // test("User is created with payload data", async () => {
    //     const randomString = Math.random().toString(32);

    //     const result = await request(app)
    //         .post("/users/")
    //         .send({
    //             login: "user-" + randomString,
    //             password: randomString,
    //         });

    //     console.log(randomString);

    //     expect(result.statusCode).toBe(200);
    // });
});
