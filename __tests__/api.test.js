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

describe("All /api endpoints", () => {
  test("GET /api returns endpoints.json", async () => {
    const { body } = await request(app).get("/api").expect(200);
    const endpoints = require("../endpoints.json");
    expect(body.endpoints).toEqual(endpoints);
  });
});

describe("Articles", () => {
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
    test("Can sort by asc or desc using various query topic parameters", async () => {
      let res = await request(app)
        .get("/api/articles?sort_by=author")
        .expect(200);
      expect(res.body.articles.length === 12).toBe(true);
      expect(res.body.articles).toBeSortedBy("author", { descending: true });

      res = await request(app)
        .get("/api/articles?sort_by=title&order=ASC")
        .expect(200);
      expect(res.body.articles.length === 12).toBe(true);
      expect(res.body.articles).toBeSortedBy("title", { descending: false });
    });
    test("pagination - default is 12 long", async () => {
      let res = await request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200);
      expect(res.body.articles.length === 12).toBe(true);
    });
    test("pagination - limit 5, page 1 gives articles 1-5 page 2 gives 6-10 etc", async () => {
      let res = await request(app)
        .get("/api/articles?sort_by=article_id&limit=5&page=1&order=ASC")
        .expect(200);
      expect(res.body.articles.length === 5).toBe(true);
      expect(res.body.articles).toBeSortedBy("article_id", {
        descending: false,
      });
      expect(res.body.articles[0].article_id === 1).toBe(true);
      expect(res.body.articles[4].article_id === 5).toBe(true);
    });
    test("400 returned for a bad request (invalid sort_by query) ", async () => {
      let res = await request(app)
        .get("/api/articles?sort_by=invalid-column")
        .expect(400);
      expect(res.body.msg).toBe("Bad Request");
    });
  });

  describe("POST /api/articles", () => {
    test("returns posted article object", async () => {
      const { body } = await request(app)
        .post("/api/articles")
        .send({
          newArticle: {
            author: "butter_bridge",
            title: "tis a title",
            body: "tis some stuff",
            topic: "paper",
          },
        })
        .expect(200);
      expect(body.insertedArticle).toMatchObject({
        author: "butter_bridge",
        title: "tis a title",
        body: "tis some stuff",
        topic: "paper",
        article_id: expect.any(Number),
        votes: 0,
        created_at: expect.any(String),
      });
      const newArticleId = body.insertedArticle.article_id;
      const res = await request(app)
        .get(`/api/articles/${newArticleId}`)
        .expect(200);
      expect(res.body.article).toMatchObject({
        author: "butter_bridge",
        title: "tis a title",
        body: "tis some stuff",
        topic: "paper",
        article_id: expect.any(Number),
        votes: 0,
        created_at: expect.any(String),
        comment_count: "0",
      });
    });

    test("400 for bad errors", async () => {
      let res = await request(app)
        .post("/api/articles")
        .send({
          newArticle: {
            //author: "butter_bridge",
            //title: "tis a title",
            //body: "tis some stuff",
            //topic: "paper",
          },
        })
        .expect(400);
      expect(res.body.msg).toBe("Bad Request");

      res = await request(app).post("/api/articles").send({}).expect(400);
      expect(res.body.msg).toBe("Bad Request");
    });
  });

  describe("DELETE /api/articles", () => {
    test("delete article by id", async () => {
      await request(app).delete("/api/articles/2").expect(204);
      const res = await request(app).get("/api/articles/2").expect(404);
      expect(res.body.msg).toBe("Not Found");
    });
    test("404 to delete non-existent article", async () => {
      const { body } = await request(app)
        .delete("/api/articles/99999999")
        .expect(404);
      expect(body.msg).toBe(
        "Not Found, maybe this comment was already deleted?"
      );
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
      const { body } = await request(app)
        .get("/api/articles/999999")
        .expect(404);
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

  describe("GET /api/articles/:article_id/comments", () => {
    test("responds with appropriate array of comment objects (also default pagination limit to 10)", async () => {
      const { body } = await request(app)
        .get("/api/articles/1/comments")
        .expect(200);
      expect(body.comments.length).toBe(10);
      body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
    });
    test("pagination - limit works ", async () => {
      const { body } = await request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200);
      expect(body.comments.length).toBe(5);
      body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("posts comment and returns new comment", async () => {
      const newComment = {
        username: "butter_bridge",
        body: "this is a comment",
      };
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(200);
      expect(body.postedComment).toMatchObject({
        comment_id: expect.any(Number),
        votes: 0,
        created_at: expect.any(String),
        author: newComment.username,
        body: newComment.body,
      });
    });
    test("404 for invalid user", async () => {
      const newComment = {
        username: "this user dont exist",
        body: "this is a comment",
      };
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400);
      expect(body.msg).toBe("Bad Request");
    });
    test("404 for no body", async () => {
      const newComment = {
        username: "this user dont exist",
      };
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400);
      expect(body.msg).toBe("Bad Request");
    });
  });
});

describe("Comments", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("deletes the comment id correctly", async () => {
      await request(app).delete("/api/comments/1").expect(204);
      const { body } = await request(app)
        .get("/api/articles/9/comments")
        .expect(200);
      body.comments.forEach((comment) => {
        expect(comment.comment_id).not.toBe(1);
      });
    });
    test("404 for comment_id not existing", async () => {
      const { body } = await request(app)
        .delete("/api/comments/999999")
        .expect(404);
      expect(body.msg).toBe("Comment does not exist");
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    test("Increases vote by count, positively (comment_id of 17 has 20 votes default)", async () => {
      const { body } = await request(app)
        .patch("/api/comments/17")
        .send({ inc_votes: 1 })
        .expect(200);
      expect(body.updatedComment.votes).toBe(21);
    });
    test("Decreases vote by count (comment_id of 17 has 20 votes default)", async () => {
      const { body } = await request(app)
        .patch("/api/comments/17")
        .send({ inc_votes: -1 })
        .expect(200);
      expect(body.updatedComment.votes).toBe(19);
    });
    test("404 on non-existent comment", async () => {
      const { body } = await request(app)
        .patch("/api/comments/999999")
        .send({ inc_votes: -1 })
        .expect(404);
      expect(body.msg).toBe("Comment does not exist");
    });
    test("400 on bad comment_id", async () => {
      const { body } = await request(app)
        .patch("/api/comments/notvalid")
        .send({ inc_votes: -1 })
        .expect(400);
      expect(body.msg).toBe("Bad Request");
    });
  });
});

describe("Topics", () => {
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
    test("post topic", async () => {
      const newTopic = { slug: "yes", description: "this" };
      const { body } = await request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(200);
      expect(body.newTopic).toMatchObject(newTopic);
    });
    test("no topic no worky", async () => {
      const { body } = await request(app).post("/api/topics").expect(400);
      expect(body.msg).toBe("Bad Request");
    });
  });
});

describe("Users", () => {
  describe("GET /api/users", () => {
    test("Returns array of user objects *which contain only the username*", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      expect(body.users.length > 0).toBe(true);
      body.users.forEach((user) => {
        expect(user).toMatchObject({ username: expect.any(String) });
      });
    });
  });
  describe("GET /api/users/:username", () => {
    test("Returns user object", async () => {
      const { body } = await request(app)
        .get("/api/users/rogersop")
        .expect(200);
      expect(body.user).toMatchObject({
        username: "rogersop",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        name: "paul",
      });
    });
    test("404 for not found", async () => {
      const { body } = await request(app)
        .get("/api/users/non-existent")
        .expect(404);
      expect(body.msg).toBe("Not Found");
    });
  });
});
