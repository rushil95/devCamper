const express = require("express");
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

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router
  .route("/radius/:zipcode/:distance")
  .get(getBootcampsWithinRadius)  

module.exports = router;
