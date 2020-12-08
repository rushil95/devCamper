const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/Geocoder");

/*  @desc Get all bootcamps
    @route GET /api/v1/bootcamps
    @access Public
*/
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    //Copying the query object
    let reqQuery = {
        ...req.query
    };
    //Fields to be removed from the query object
    const removeFields = ["sort", "select", "limit", "page"];
    //Removing prperties from obj
    removeFields.forEach((field) => delete reqQuery[field]);

    let query;
    let queryStr = JSON.stringify(reqQuery).replace(
        /\b(lt|lte|gt|gte|in)\b/g,
        (match) => `$${match}`
    );
    query = Bootcamp.find(JSON.parse(queryStr));

    if (req.query.select) {
        const selectStr = req.query.select.split(",").join(" ");
        query.select(selectStr);
    }

    if (req.query.sort) {
        const sortStr = req.query.select.split(",").join(" ");
        query.sort(sortStr);
    } else {
        const sortStr = "-createdAt";
        query.sort(sortStr);
    }

    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 1;

    const skip = (page - 1) * limit;
    const startIndex = skip;
    const endIndex = skip + limit;

    const totalDocs = await Bootcamp.countDocuments();
    let pagination = {};
    if (skip > 0) pagination.prev = page - 1;
    console.log(totalDocs,endIndex)
    if (totalDocs > endIndex) pagination.next = page + 1;

    query.skip(skip).limit(limit);
    const bootcamps = await query;
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        pagination,
        data: bootcamps,
    });
});

/*  @desc Get bootcamp by id
    @route GET /api/v1/bootcamp/id
    @access Public
*/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404)
        );
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

/*  @desc Create new bootcamp
    @route POST /api/v1/bootcamps
    @access Private
*/
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json(bootcamp);
});

/*  @desc Update bootcamp
    @route POST /api/v1/bootcamps/id
    @access Private
*/
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!bootcamp) {
        return res.status(400).json({
            success: false,
        });
    }
    res.status(200).json({
        bootcamp,
    });
});

/*  @desc Delete bootcamp
    @route POST /api/v1/bootcamps/id
    @access Private
*/
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
       return next(new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404))
    }

    const deletedBootcamp = await bootcamp.remove()

    res.status(200).json({
        success: true,
        data: deletedBootcamp,
    });
});

/* @desc Get bootcamps within a radius of 
   @route GET /api/v1/bootcamps/:zipcode/:distance
   @access Public
 */
exports.getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
    const {
        zipcode,
        distance
    } = req.params;

    const loc = await geocoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

    //get radius in radians
    //divide distance by earth's radius
    const radius = distance / 3959;
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [longitude, latitude], radius
                ]
            },
        },
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: {
            bootcamps
        },
    });
});