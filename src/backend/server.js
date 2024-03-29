import express from "express";
import cors from "cors";
import multer from "multer";
import ejs from "ejs";
import path from "path";
import databaseController from "./controllers/databaseController.js";
import ownerController from "./controllers/ownerController.js";
import friendListController from "./controllers/friendListController.js";
import postWalkController from "./controllers/postWalkController.js";
import ownsDogController from "./controllers/ownsDogController.js";
import walkController from "./controllers/walkController.js";
import wentForController from "./controllers/wentForController.js";
import taggedInController from "./controllers/taggedInController.js";
import notificationController from "./controllers/notificationController.js";
import schedulesController from "./controllers/schedulesController.js";
import onMeetupController from "./controllers/onMeetupController.js";
import postMediaController from "./controllers/postMediaController.js";

const app = express();
const PORT = 8800; // adjust later

// Middleware configuration
// use the commented out statement when front-end is created.
// app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(express.json());
app.use(cors());

// for media queries
// app.set("view engine", "ejs");
// app.use(express.static("./images"));
// app.get("/upload", (req, res) => {
//   res.render("index");
// });

// Router mounting
// Notes: add a new app.use("/{entity-name}", {entity-nameController}) here
// when creating a new entity. Don't forget to import.
app.use("/", databaseController);
app.use("/owner", ownerController);
app.use("/friend-list", friendListController);
app.use("/posts", postWalkController);
app.use("/dog", ownsDogController);
app.use("/walk", walkController);
app.use("/went-for", wentForController);
app.use("/tagged-in", taggedInController);
app.use("/notification", notificationController);
app.use("/schedules", schedulesController);
app.use("/meetup", onMeetupController);
app.use("/media", postMediaController);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
