import request from "supertest";
import { app } from "../..";
import { IBlogger } from "../../entity/Blogger";

import { mongoDBClient } from "../../respositories/db";

describe("Test the bloggers", () => {
    let testBlogger: IBlogger;

    beforeAll(async () => {
        await mongoDBClient.connect();
    });

    afterAll(async () => {
        await mongoDBClient.close();
    });

    test("Bloggers route should response the GET method with status code 200", async () => {
        const result = await request(app).get("/bloggers/");

        expect(result.statusCode).toBe(200);
    });

    test("Bloggers route should response the GET method for not found blogger and status code 404", async () => {
        const result = await request(app).get("/bloggers/1");

        expect(result.statusCode).toBe(404);
    });

    test("Blogger are created with payload data", async () => {
        const result = await request(app).post("/bloggers/").send({
            name: "Vlad",
            youtubeUrl: "https://youtubefake.com",
        });

        testBlogger = result.body;

        expect(result.statusCode).toBe(201);
        expect(result.body.id).toBeDefined();
    });

    test("Created blogger if defined in sever BD", async () => {
        const result = await request(app).get(`/bloggers/${testBlogger.id}`);

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(testBlogger);
    });

    test("Update Blogger with payload data and status code 204", async () => {
        testBlogger = {
            id: testBlogger.id,
            name: "Dimych",
            youtubeUrl: "https://youtube.com",
        };

        const result = await request(app)
            .put(`/bloggers/${testBlogger.id}`)
            .send(testBlogger);

        expect(result.statusCode).toBe(204);
    });

    test("Updated blogger to be defined", async () => {
        const result = await request(app).get(`/bloggers/${testBlogger.id}`);

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(testBlogger);
    });

    test("Delete blogger send status code 200", async () => {
        const result = await request(app).delete(`/bloggers/${testBlogger.id}`);

        expect(result.statusCode).toBe(204);
    });

    test("Deleted blogger is not defined", async () => {
        const result = await request(app).get(`/bloggers/${testBlogger.id}`);

        expect(result.statusCode).toBe(404);
    });
});
