var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// ========== Configure CORS ==========
app.use(
  cors({
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
      "Authorization",
    ],
    methods: "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
  })
);
// ====================================

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

require("./middlewares/passport")(app);

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
