const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");

afterAll(() => db.end());

describe("general 404 error handling", () => {
  test("404 - successful error handling", () => {
    return request(app)
      .get("/this-url-does-not-exist-404")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/topics", () => {
  test("returns and array of topic objects, containing slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length > 0).toBe(true);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("returns an article object with the below properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1594329060000,
          votes: 100,
        });
      });
  });
  test("returns 404 for non-existent article", () => {
    return request(app)
      .get("/api/articles/99999999999999999")
      .expect(404)
      .then(({ body }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("returns 400 for bad request (non-numeric id passed)", () => {
    return request(app)
      .get("/api/articles/not-a-valid-id")
      .expect(400)
      .then(({ body }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});
