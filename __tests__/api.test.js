const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");

afterAll(() => db.end());
beforeEach(() => seed(testData));


describe("general 404 error handling", () => {
  test("404 - successful error handling", async () => {
    const { body } = await request(app)
      .get("/this-url-does-not-exist-404")
      .expect(404);
    expect(body.msg).toBe("Not Found");
  });
});

describe("GET /api/topics", () => {
  test("returns and array of topic objects, containing slug and description properties", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    expect(body.topics.length > 0).toBe(true);
    body.topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("returns an article object with the below properties", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    expect(body.article).toMatchObject({
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
    });
  });
  test("returns 404 for non-existent article", async () => {
    const { body } = await request(app).get("/api/articles/999999").expect(404);
    expect(body.msg).toBe("Not Found");
  });
  test("returns 400 for bad request (non-numeric id passed)", async () => {
    const { body } = await request(app)
      .get("/api/articles/not-a-valid-id")
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
});
