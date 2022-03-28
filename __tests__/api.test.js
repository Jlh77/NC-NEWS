const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("Seed works", () => {
  test("dummy", () => {});
});

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
        console.log(body);
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
