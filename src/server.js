import express from "express";
import databaseController from "./backend/controllers/databaseController.js";
import ownerController from "./backend/controllers/ownerController.js";

const app = express();
const PORT = 8800; // adjust later

// Middleware configuration
// use the commented out statement when front-end is created.
// app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(express.json());

// Router mounting
// Notes: add a new app.use("/{entity-name}", {entity-nameController}) here
// when creating a new entity. Don't forget to import.
app.use("/", databaseController);
app.use("/owner", ownerController);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
