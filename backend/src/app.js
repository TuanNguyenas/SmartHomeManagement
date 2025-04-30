const compression = require("compression");
const express = require("express");
const cors = require("cors");
const app = express();
if (process.env.NODE_ENV === "production") {
  app.use(express.static("public"));
}

// init middlewares
if (process.env.NODE_ENV !== "production") {
  const swaggerDocs = require("../swagger");
  require("dotenv").config();
  const morgan = require("morgan");
  app.use(morgan("dev"));
  // init swagger
  swaggerDocs(app);
}

app.use(compression());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: "*",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
const initRedis = require("./dbs/init.redis");
initRedis.initRedis();

// init scheduler
const initCronJobs = require("./cron/cronScheduler");
const { initializeFirebase } = require("./config/firebase");
initCronJobs.initCronJobs();

// init firebase
initializeFirebase();

// init routes
app.use("/", require("./routes/index"));

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
