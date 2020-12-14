const express = require('express')
const advancedResults = require("../middleware/advancedResults")
const Course = require("../models/Course")
const { getAllCourses, getSingleCourse : getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courses')
console.log(getAllCourses)

const router = express.Router({ mergeParams : true});

router
    .route('/')
    .get(advancedResults(Course),getAllCourses)
    .post(createCourse)

router
    .route('/:courseId')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse)

module.exports = router    