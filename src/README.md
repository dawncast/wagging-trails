# Development Guide README

This will be a detailed guide for our team to create the project within format and done efficiently. Currently only for back-end development.

## Setting Up

### Applications Used

Not really required, but makes it easier to develop the back-end.

MySQL Workbench: https://dev.mysql.com/downloads/workbench/

- used to keep track of tables for prototyping.
- make sure you created an instance on the workbench. Typically the account would be root with a password you created. But you can also add a new account.

Postman: https://www.postman.com/downloads/

- used to test HTTPS methods (GET, POST, PUT)

### Installing Dependencies

Make sure to install everything first in the src directory.

```
npm install
```

## Directory

```
src/
│
├── backend/
│   ├── controllers/   # controller files which call services files
│   ├── services/      # services files which handles calls to the db
|
├── public/
│   ├── # here would be our front-end files
|
├── scripts/
│   ├── # tentative
|
├── server.js # calls controller files
```

Currently, we have only set up the template for the backend of the project. There are two main folders for it. Controller and services. **Each entity should have there own files of each** to separate entities and easier implementation.

## Starting the codebase

### Setting up your .env file

Create a file called .env in your src directory. We just need to have the data for back-end for now.

```
USER=your_username_on_mysql_workbench
PASS=your_password_on_mysql_workbench
DATABASE=your_schema_name_on_mysql_workbench
```

I implemented these values on MySQL workbench. I'm sure there are other ways to do this. For the DATABASE, enter your local instance and create a new schema on the Schema window on the left.

### Starting the program

use on the src directory:

```
npm start
```

If the .env and other set ups are done correctly, you should see this in the terminal:

```
> project-304@1.0.0 start
> nodemon server.js

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
Server running at http://localhost:8800/
Connection pool started
```

We will be using _nodemon_ for fast prototyping. It restarts the program everytime we update the codebase. The deployment for now would also be in localhost port 8800, but we can change it later after prototyping.

## Developing Entities

You can do this in two ways:

- server.js->{**entity-name**}Controller.js->{**entity-name**}Service.js
- or the other way around.

This guide will be showing how to develop it in the first way.

### server.js

1. Add an import statement to the entity's controller you will develop. An example would be the ownerController:

```javascript
import ownerController from "./backend/controllers/ownerController.js";
```

2. Mount the router. This way, we can call the controllers separately via different addresses for the front end. Here is another example:

```javascript
app.use("/owner", ownerController);
```

### {**entity-name**}Controller.js

There would be three key things to consider while implementing:

**GET requests:** For fetching rows from the database.

**POST requests:** For inserting items into the database.

**PUT requests:** For updating rows from the database.

Note that the complexity of each one of these would depend on the entity being created. Which means Dog and Owner entities are the hardest to implement :pensive:

Here is an example of a simple GET request:

```javascript
router.get("/", async (req, res) => {
  const tableContent = await fetchOwnersFromDB();
  res.json({ data: tableContent });
});
```

For this example, since we are implementing this via this address:
http://localhost:8800/owner/

We would see a received json data depending on what content we the service returns.
Note that **router** from **router.get()** is just an object that handles routes and middleware stuff :smiley:

To prototype or test while coding this, you can use Postman which is very easy to use. You can set up a JSON file there as well and check if the database did update :smiley:

For more details on implementation and different requests, check _ownerController.js_. It has some documentation there as well.

### {**entity-name**}Service.js

:pensive: :pensive: :pensive:

Service files' complexity will depend on how complex the schemas are. There would be three keys as well for developing this:

1. **Initialization:** To instantly create tables without touching the workbench. The number of tables you create here depends on how many tables created after normalization.

2. **Destroying Tables:** _I haven't implemented this yet._

3. **Request Implementations:** Mostly the bulk of the work. The number of functions to be implemented will depend on how many functions created in the controller file.

**NOTE:** It may be easier to develop one function side-by-side with the controller function.

These are mainly asynchronous functions. In a very high-level explanation, the code will look like this:

```javascript
// Function called from a router.get()
async function fetchFromDB() {
  // write your query here:
  const query = "SELECT * FROM schema-name.table";

  return new Promise((resolve, reject) => {
    // does the query to the database.
    pool.query(query, (err, res) => {
      // after doing the query, you can check if the connection is
      // erroneous. And example would be:
      if (err) return reject(err);

      // if everything was successful, resolve makes it send a success flag.
      resolve(res);
    });
  });
}
```

For other functions that needed more than one queries, you should first use **pool.getConnection()** instead of **pool.query()**, then have an async function called **executeQueries()** to do the queries you need. Here is an example:

```javascript
// Function called from a router.get()
async function fetchFromDB() {
  return new Promise((resolve, reject) => {
    // establish the connection.
    pool.connection(query, (err, res) => {
      // add the queries here using an async function
      const executeQueries = async () => {
        // a try-catch method is optional but recommended
        // as long as if it's successful, have a resolve() value
        // at the end
        try {
          // Do the query
          const contactQuery = "INSERT INTO R (a) VALUES (?)";
          const contactValues = [b];
          await connection.query(contactQuery, contactValues);
          // if it works out, return.
          resolve(true);
        } catch (error) {
          reject(error);
        } finally {
          // always release the connection after.
          connection.release();
        }
      };
    });
  });
}
```

## Other Notes:

I've written some explanations on how to develop larger asynchronous functions in service files. It might be better to look this up after trying to create the functions first.

### Creating multiple tables in one function

Since we have a lot of normalized entities, it might be better to understand how you can create multiple tables in one go. You probably can just look up how to do it.

```javascript
async function initiateTable() {
  // say you have two normalized tables:
  const createTableQueries = ["CREATE TABLE R_1", "CREATE TABLE R_2"];
  return new Promise((resolve, reject) => {
    // Get the connection.
    pool.getConnection((err, connection) => {
      // check if erroneous first.

      const executeQueries = async () => {
        // all queries will be executed in a for each loop.
        for (const query of createTableQueries) {
          try {
            await connection.query(query);
          } catch (error) {
            // if there was an erroneous query, it will be rejected
            reject(error);
            return;
          }
        }
        resolve(true); // return succesfully
      };

      executeQueries().finally(() => {
        connection.release(); // Release the connection
      });
    });
  });
}
```

You can probably just copy this template and edit it a bit for the queries you need.

### MySQL Transactions, Commits, and Rollbacks

Here is when you are creating compound statements. I firstly used this for multiple insertion statements for normalized tables. Imagine something like this:

```sql
INSERT INTO R_1
INSERT INTO R_2
INSERT INTO R_3
```

It might be better (or you need to) insert something in a compound manner because of the foreign key dependencies. This is where we can use transactions, commits, and rollbacks.

A high-level explanation would be like this:

```javascript
const executeQueries = async () => {
  try {
    // Start transaction
    await connection.query("START TRANSACTION");

    // Do the first query
    const contactQuery = "INSERT INTO R_1 (a, b) VALUES (?, ?)";
    const contactValues = [c, d];
    await connection.query(contactQuery, contactValues);

    // Do the second query
    const contactQuery = "INSERT INTO R_2 (x, y, z) VALUES (?, ?, ?)";
    const contactValues = [e, f, g];
    await connection.query(contactQuery, contactValues);

    // Commit the transaction
    await connection.query("COMMIT");

    // if it works out, return.
    resolve(true);
  } catch (error) {
    // Rollback the transaction in case of error
    await connection.query("ROLLBACK");
    reject(error);
  } finally {
    connection.release();
  }
};
```

There might be issues depending on how the dependencies are created. We can probably fix it together along the way :smiley:
