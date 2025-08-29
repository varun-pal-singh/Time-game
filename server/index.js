// const express = require("express");
// const app     = express();
// const dotenv  = require("dotenv");
// const cors    = require("cors");
// const path    = require("path");
// const router  = require("./router/index.js");

// dotenv.config({ path: "config/config.env" });
// app.use(express.json());
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());

// // app.use(bodyparser.urlencoded({ extended: true }));
// // app.use(fileupload());
// app.use(cors({
//   origin: ['http://localhost:5000', 'http://192.168.10.116:5000', 'http://103.69.170.74:5000'],
//   credentials: true
// }));

// app.use(express.static(path.join(__dirname, "..", "client", "build")));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
// });

// const mongoose = require("mongoose");
// const { urlencoded } = require("express");
// require("./db/config");

// app.use("/api", router);  

// app.listen(process.env.PORT || 5000, (e) => {
//   if (e) {
//     console.log("Error");
//     return;
//   }
//   console.log(`Server Running fine on port ${process.env.PORT || 5000}`);
// });

const express       = require("express");
const dotenv        = require("dotenv");
const cors          = require("cors");
const cookieParser  = require("cookie-parser");
const mongoose      = require("mongoose");
const router        = require("./router/index.js");
const path          = require("path");

dotenv.config({ path: "config/config.env" });
const DB_URL = process.env.db;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Correct CORS configuration
app.use(cors({
  origin: ['http://localhost:5000', 'http://192.168.10.116:5000', 'http://103.69.170.74:5000'],
  credentials: true
}));

// Database connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
// app.use("/", router);
app.use("/api", router);  // it automatically prepend by "/api" to all backend routes

// Start server
app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    console.error("Server error:", err);
    return;
  }
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});