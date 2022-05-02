import request from "supertest";
import { app } from "../..";

import { mongoDBClient } from "../../respositories/db";

describe("Test the bloggers", () => {
    beforeAll(async () => {
        await mongoDBClient.connect();
    });

    afterAll(async () => {
        await mongoDBClient.close();
    });

    test("It should response the GET method with status code 200", async () => {
        const result = await request(app).get("/bloggers/");

        expect(result.statusCode).toBe(200);
    });

    test("It should response the GET method for not found blogger and status code 404", async () => {
        const result = await request(app).get("/bloggers/1");

        expect(result.statusCode).toBe(404);
    });
});
