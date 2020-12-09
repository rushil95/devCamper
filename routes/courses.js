const express = require('express')
const { getAllCourses, getSingleCourse : getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courses')
console.log(getAllCourses)

const router = express.Router({ mergeParams : true});

router
    .route('/')
    .get(getAllCourses)
    .post(createCourse)

router
    .route('/:courseId')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse)

module.exports = router    