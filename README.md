# Joe's News API

This project is an example news API that seeds a Postgresql database (with Test, Development and Production options) when run and has multiple api end points for this database.

To see all available end points and example responses, a GET request can be made to https://nc-news77.herokuapp.com/api, or look at the endpoints.json file in this repository.

## Link To Hosted Version

A live version of this project is running here on Heroku: https://nc-news77.netlify.app/

With the api being served from heroku here: https://nc-news77.herokuapp.com/

## Setup

Recommended minimum versions: Node - version 8, PSQL - version 12.

To clone this project for yourself, you will need to:

1.  Clone this repo with Git

2.  Make sure to install dependencies for the project:

    ```
    $ npm install
    ```

3.  Set up some environment variables. You will need to create a .env.development and .env.test file in the route of this repo. Each one needs to contain one variable: PGDATABASE=databasename. (These names come from ./db/setup.sql, if you wish to change the names make sure to change them there).

    .env.development --->

    ```
    PGDATABASE=nc_news
    ```

    .env.test --->

    ```
    PGDATABASE=nc_news_test
    ```

4.  Seed your local database - First, make sure you are running Postgresql on your machine. Then simply run the following command which will seed the database:

    ```
    $ npm run setup-db
    ```

    This will create the databases necessary for running this project and only needs to be run once.

5.  Start running tests! To run jest and start tests, run:

    ```
    $ npm test
    ```

    or simply:

    ```
    $ npm t
    ```

    The tables in the database will be re-seeded before every test.

    You can also run

    ```
    $ node app.listen.js
    ```

    to start a server and make request to you localhost, which will run in development mode.
