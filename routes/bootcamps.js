const express = require("express");
const courseRouter = require("./courses")
const {
  getAllBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsWithinRadius
} = require("../controllers/bootcamps");

const router = express.Router();

router.route("/").get(getAllBootcamps).post(createBootcamp);

router.use("/:bootcampId/courses", courseRouter)

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router
  .route("/radius/:zipcode/:distance")
  .get(getBootcampsWithinRadius)

module.exports = router;