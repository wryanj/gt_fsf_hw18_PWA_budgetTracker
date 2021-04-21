/* -------------------------------------------------------------------------- */
/*                              Setup Server                                  */
/* -------------------------------------------------------------------------- */

/* --------------------------- Import Dependencies -------------------------- */

  const path = require("path");
  const express = require("express");
  const logger = require("morgan");
  const mongoose = require("mongoose");
  const compression = require("compression");

/* ------------------------------ Specify Port ------------------------------ */
  // Define Port
  const PORT = process.env.PORT || 3000;

  // Define Express Instance
  const app = express();

/* ---------------------------- Setup Middleware ---------------------------- */

  app.use(logger("dev"));
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  //app.use(express.static("public"));
  app.use(express.static(path.join(__dirname, 'public')));

/* ------------------- Setup Connection to MongoDB Server ------------------- */

  // This is also where I define the database name as 'budget'- it is established the first time I run the server
  mongoose.connect (
    process.env.MONGODB_URI ||"mongodb://localhost/budget", 
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useFindAndModify: true
    }
  );

/* -------------------------- Define Route Mounting ------------------------- */

  // Use routes exported from routes/api file for all requests
  app.use(require("./routes/api.js"));

/* ------------------------------ Start Server ------------------------------ */
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });