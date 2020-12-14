const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
//Load env variables
dotenv.config({
  path: "./config/config.env"
});
//Load bootcamp routes
const bootcampsRouter = require('./routes/bootcamps');
//Load courses routes
const coursesRouter = require('./routes/courses')
//Load authRoutes
const authRouter = require('./routes/auth')
//Load errorHandler middleware
const errorHandler = require("./middleware/error");




connectDB()
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(fileUpload());
app.use(express.static('public'));
app.use('/api/v1/bootcamps', bootcampsRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/auth', authRouter)
app.use(errorHandler);




const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit proccess
  server.close(() => process.exit(1))
})