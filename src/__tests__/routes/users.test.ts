import request from "supertest";
import { app } from "../..";

import { mongoDBClient } from "../../respositories/db";
import { IUser } from "../../entity/User";

describe("Test the bloggers", () => {
    let testUser: IUser;

    const basicAuthToken = "Basic YWRtaW46cXdlcnR5";

    beforeAll(async () => {
        await mongoDBClient.connect();
    });

    afterAll(async () => {
        await mongoDBClient.close();
    });

    test("Users route response the GET method with status code 200", async () => {
        const result = await request(app).get("/users/");

        expect(result.statusCode).toBe(200);
    });

    test("Users route response the GET method for not found blogger and status code 404", async () => {
        const result = await request(app).get("/users/1");

        expect(result.statusCode).toBe(404);
    });

    test("Create user failed without Basic authorization", async () => {
        const randomString = Math.random().toString(32);

        const result = await request(app)
            .post("/users/")
            .send({
                login: "user-" + randomString,
                password: randomString,
            });

        expect((result as any).request.header.Authorization).toBeUndefined();
        expect(result.statusCode).toBe(401);
    });

    test("User is created with payload data with authorization", async () => {
        const randomString = Math.random().toString(32);

        const result = await request(app)
            .post("/users/")
            .send({
                login: "user-" + randomString,
                password: randomString,
            })
            .set({ Authorization: basicAuthToken });

        testUser = result.body;

        expect((result as any).request.header.Authorization).toBe(
            basicAuthToken
        );
        expect(result.statusCode).toBe(201);
    });

    test("Delete user failed without authorization", async () => {
        const result = await request(app).delete(`/users/${testUser.id}`);

        expect((result as any).request.header.Authorization).toBeUndefined();
        expect(result.statusCode).toBe(401);
    });

    test("Delete user send status code 200", async () => {
        const result = await request(app)
            .delete(`/users/${testUser.id}`)
            .set({ Authorization: basicAuthToken });

        expect((result as any).request.header.Authorization).toBe(
            basicAuthToken
        );
        expect(result.statusCode).toBe(204);
    });
});
