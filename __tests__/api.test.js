const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const supertest = require("supertest");
const app = requrie("../app.js");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("Seed works", () => {
  test("dummy", () => {});
});

describe("general 404 error handling", () => {
  test("404 - successful error handling", () => {
    return request(app)
      .get("/this-url-does-not-exist-404")
      .expect(400)
      .then((res) => {
        expect(res.msg).toBe("not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("returns and array of topic objects, containing slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.topic.length > 0).toBe(true);
        res.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
