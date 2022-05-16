const db = require("../connection");
const { updatedAtFunction, updatedAtTrigger } = require("./triggers");

const createTables = async () => {
  // Creates an updated_at function which each trigger below will use
  await db.query(updatedAtFunction());

  const topicsTablePromise = db.query(`
  CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
  );`);

  const usersTablePromise = db.query(`
  CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR,
    salt VARCHAR,
    original_method VARCHAR(2),
    avatar_url VARCHAR,
    verified BOOL NOT NULL DEFAULT false,
    google_id VARCHAR,
    google_display_name VARCHAR,
    google_email VARCHAR,
    facebook_id VARCHAR,
    facebook_email VARCHAR,
    joined TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );${updatedAtTrigger("users")}`);

  await Promise.all([topicsTablePromise, usersTablePromise]);

  await db.query(`
    CREATE TABLE user_reset_tokens (
      reset_token_id SERIAL PRIMARY KEY,
      email VARCHAR NOT NULL,
      token VARCHAR NOT NULL,
      expiration TIMESTAMP NOT NULL,
      used BOOL NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );${updatedAtTrigger("user_reset_tokens")}`);

  await db.query(`
  CREATE TABLE user_sessions (
    sid VARCHAR PRIMARY KEY NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
  );`);

  await db.query(`
  CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL REFERENCES topics(slug),
    author VARCHAR NOT NULL REFERENCES users(username),
    body VARCHAR NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );${updatedAtTrigger("articles")}`);

  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );${updatedAtTrigger("comments")}`);
};

const dropTables = async () => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS user_reset_tokens;`);
  await db.query(`DROP TABLE IF EXISTS user_sessions;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
};

module.exports = { createTables, dropTables };
