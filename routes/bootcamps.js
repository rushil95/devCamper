const express = require("express");
const courseRouter = require("./courses")
const advancedResults = require("../middleware/advancedResults")
const Bootcamp = require("../models/Bootcamp")
const {
  getAllBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsWithinRadius,
  uploadPhoto
} = require("../controllers/bootcamps");

const router = express.Router();

router.route("/")
  .get(advancedResults(Bootcamp,'courses'),getAllBootcamps)
  .post(createBootcamp);

router.use("/:bootcampId/courses", courseRouter)

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/:id/photo")
.put(uploadPhoto)  

router
  .route("/radius/:zipcode/:distance")
  .get(getBootcampsWithinRadius)

module.exports = router;