const express = require('express')
const { getAllCourses } = require('../controllers/courses')
console.log(getAllCourses)

const router = express.Router({ mergeParams : true});

router
    .route('/')
    .get(getAllCourses)

module.exports = router    