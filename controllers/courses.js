const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp")
const asyncHandler = require('../middleware/async')
const error = require('../middleware/error')
const ErrorResponse = require("../utils/ErrorResponse");
const {
    findByIdAndUpdate
} = require("../models/Bootcamp");

/*  @desc Get all courses
    @route GET /api/v1/bootcamps/:bootcampId/courses
    @route GET /api/v1
    @access Public
*/
exports.getAllCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId
        })
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }
    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})

/*  @desc Get single course by id
    @route GET /api/v1/bootcamps/:bootcampId/courses/:courseId
    @access Public
*/
module.exports.getSingleCourse = asyncHandler(async (req, res, next) => {
    console.log(req.params)
    const {
        courseId
    } = req.params
    const course = await Course.findById(courseId)

    if (!course) {
        return next(new ErrorResponse(`Resource with id ${courseId} not found`, 404))
    }

    res.status(200).json({
        success: true,
        data: course
    })
})

/*  @desc Create a new course
    @route POST /api/v1/bootcamps/:bootcampId/courses/
    @access Private
*/
exports.createCourse = asyncHandler(async (req, res, next) => {
    const {
        bootcampId
    } = req.params

    const bootcamp = await Bootcamp.findById(bootcampId)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id ${bootcampId} doesn't exist. Please use a valid bootcamp id`, 400))
    }

    req.body.bootcamp = bootcampId
    const course = await Course.create(req.body)

    res.status(201).json({
        success: true,
        data: course
    })
})

/*  @desc Update course
    @route PUT /api/v1/courses/:courseId
    @access Private
*/
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const courseId = req.params.courseId;

    const course = await Course.findByIdAndUpdate(courseId, req.body, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        success: true,
        data: course
    })
})

/*  @desc Delete course
    @route DELETE /api/v1/courses/:courseId
    @access Private
*/
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const courseId = req.params.courseId;  
    const course = await Course.findById(courseId)

    if (!course) {
        return next(new ErrorResponse(`Course with id ${courseId} not found`, 400));
    }

    const deletedCourse = await course.deleteOne()
    res.status(200).json({
        success: true,
        data: deletedCourse
    })
})