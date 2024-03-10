import pool from "./databaseService.js";

/**
 * Fetches Owner(id, email). Use this to template fetch functions.
 * @returns results
 */
async function fetchOwnersFromDB() {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM owner", (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

/**
 * Initializes three normalized, owner tables.
 * Use this when your database does not have this table yet.
 *
 * @returns true or error message.
 */
async function initiateOwners() {
  const createTableQueries = [
    "CREATE TABLE IF NOT EXISTS Owner (ownerID INTEGER SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL)",
    "CREATE TABLE IF NOT EXISTS Owner_Name (ownerID INTEGER PRIMARY KEY, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, FOREIGN KEY (ownerID) REFERENCES Owner (ownerID) ON DELETE CASCADE)",
    "CREATE TABLE IF NOT EXISTS Owner_Contact (email VARCHAR(255) PRIMARY KEY, phoneNumber VARCHAR(255) UNIQUE, FOREIGN KEY (email) REFERENCES Owner (email) ON DELETE CASCADE ON UPDATE CASCADE)",
  ];
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const executeQueries = async () => {
        // all queries will be executed here.
        for (const query of createTableQueries) {
          try {
            await connection.query(query);
          } catch (error) {
            reject(error);
            return;
          }
        }
        resolve(true);
      };

      executeQueries().finally(() => {
        connection.release(); // Release the connection
      });
    });
  });
}

//----------------------------------------------------------------
// NOTE.
// This is a large, compound insert function for three tables.
// (Owner, Owner_Name, Owner_Contact). This was constructed
// in a way the dependencies needed for Owner_Name is satisfied.
// To group, look for simpler insertions if this confuses you.
//----------------------------------------------------------------
async function insertOwner(email, firstName, lastName, phoneNumber) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const executeQueries = async () => {
        try {
          // Start transaction
          await connection.query("START TRANSACTION");

          // Owner BASE Query Data
          const ownerQuery = "INSERT INTO Owner (email) VALUES (?)";
          const ownerValues = [email];
          await new Promise((resolve, reject) => {
            connection.query(ownerQuery, ownerValues, (err, res) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(res.insertId);
            });
          }).then(async (ownerID) => {
            // Owner NAME Query Data (connected to BASE due to dependency)
            const nameQuery =
              "INSERT INTO Owner_Name (ownerID, firstName, lastName) VALUES (?, ?, ?)";
            const nameValues = [ownerID, firstName, lastName];
            await connection.query(nameQuery, nameValues);
          });

          // Owner CONTACT Query Data
          const contactQuery =
            "INSERT INTO Owner_Contact (email, phoneNumber) VALUES (?, ?)";
          const contactValues = [email, phoneNumber];
          await connection.query(contactQuery, contactValues);

          // Commit the transaction
          await connection.query("COMMIT");
          resolve(true);
        } catch (error) {
          // Rollback the transaction in case of error
          await connection.query("ROLLBACK");
          reject(error);
        } finally {
          connection.release();
        }
      };
      executeQueries();
    });
  });
}

/**
 * Updates first and last names of an owner.
 *
 * @param {INTEGER} ownerID
 * @param {VARCHAR} newFirstName
 * @param {VARCHAR} newLastName
 * @returns
 */
async function updateOwnerName(ownerID, newFirstName, newLastName) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      const query =
        "UPDATE Owner_Name SET firstName = ?, lastName = ? WHERE ownerID = ?";
      connection.query(query, [newFirstName, newLastName, ownerID], () => {
        connection.release();
        resolve(true);
      });
    });
  });
}

/**
 * Updates email and phone number of an owner.
 * @param {INTEGER} ownerID
 * @param {VARCHAR} email
 * @param {VARCHAR} newPhoneNumber
 * @returns
 */
async function updateOwnerContact(ownerID, email, newPhoneNumber) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        // Start transaction
        connection.query("START TRANSACTION");
        const emailQuery = "UPDATE Owner SET email = ? WHERE ownerID = ?";
        connection.query(emailQuery, [email, ownerID]);

        const phoneQuery =
          "UPDATE Owner_Contact SET phoneNumber = ? WHERE email = ?";
        connection.query(phoneQuery, [newPhoneNumber, email]);
        // Commit the transaction
        connection.query("COMMIT");
        resolve(true);
      } catch (error) {
        // Rollback the transaction in case of error
        connection.query("ROLLBACK");
        reject(error);
      } finally {
        if (connection) {
          connection.release();
        }
      }
    });
  });
}

// Test Async Function. Might be helpful for templating

// async function test(id, title, desc, cover) {
//   const query =
//     "INSERT INTO test.books (id, title, `desc`, cover) VALUES (?, ? ,?, ?)";
//   const values = [id, title, desc, cover];
//   return new Promise((resolve, reject) => {
//     pool.query(query, values, (error, results, fields) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       resolve(results);
//     });
//   });
// }

export {
  fetchOwnersFromDB,
  initiateOwners,
  insertOwner,
  updateOwnerName,
  updateOwnerContact,
};
