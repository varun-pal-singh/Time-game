const Express = require("express");
const app = Express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: "config/config.env" });
app.use(Express.json());
var cookieParser = require("cookie-parser");
app.use(cookieParser());

// app.use(bodyparser.urlencoded({ extended: true }));
// app.use(fileupload());
app.use(cors());
app.use(cors({
  origin: "*", // Adjust if your frontend is running on a different port
  credentials: true, // Allow credentials like cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(require("./router/index.js"));
const mongoose = require("mongoose");
const { urlencoded } = require("express");
require("./db/config");

app.listen(process.env.PORT || 3601, (e) => {
  if (e) {
    console.log("Error");
    return;
  }
  console.log(`Server Running fine on port ${process.env.PORT || 3601}`);
});