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
app.use(cors({
  origin: ['http://localhost:5000', 'http://192.168.10.116:5000'],
  credentials: true
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