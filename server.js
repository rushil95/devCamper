const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

//Load env variables
dotenv.config({ path: "./config/config.env" });

//Load bootcamp routes
const bootcamps = require('./routes/bootcamps');

connectDB()
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/bootcamps', bootcamps);




const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit proccess
  server.close( ()=> process.exit(1))
})
