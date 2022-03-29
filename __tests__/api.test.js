const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
require("jest-sorted");

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
  test("returns an array of topic objects, containing slug and description properties", async () => {
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

describe("GET /api/articles", () => {
  test("returns an array of article objects, containing specific properties, and this array is ordered by date (descending)", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles.length === 12).toBe(true);
    body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(String),
      });
    });
    expect(body.articles).toBeSortedBy("created_at", { descending: true });
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
      comment_count: "11",
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

describe("PATCH /api/articles/:article_id", () => {
  test("returns updated object with the same id and votes incremented correctly", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 50 })
      .expect(200);
    expect(body.updatedArticle).toMatchObject({
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 150,
    });
  });
  test("also works for negative increment", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50 })
      .expect(200);
    expect(body.updatedArticle).toMatchObject({
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 50,
    });
  });
  test("400 for bad request (invalid id)", async () => {
    const { body } = await request(app)
      .patch("/api/articles/not-a-valid-id")
      .send({ inc_votes: 50 })
      .expect(400);
    expect(body.msg).toBe("Bad Request");
  });
  test("404 for not found", async () => {
    const { body } = await request(app)
      .patch("/api/articles/999999")
      .send({ inc_votes: 50 })
      .expect(404);
    expect(body.msg).toBe("Not Found");
  });
});

describe("GET /api/users", () => {
  test("Returns array of user objects *which contain only the username*", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body.users.length > 0).toBe(true);
    body.users.forEach((user) => {
      expect(user).toMatchObject({ username: expect.any(String) });
    });
  });
});
