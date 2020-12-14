const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/Geocoder");
const fileUpload = require("express-fileupload");
const path = require('path');

/*  @desc Get all bootcamps
    @route GET /api/v1/bootcamps
    @access Public
*/
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResult);
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

/* @desc Get bootcamps within a radius of 
   @route GET /api/v1/bootcamps/:zipcode/:distance
   @access Public
 */

exports.uploadPhoto = asyncHandler(async (req, res, next) => {
    const bootcampId = req.params.id;
    const bootcamp = await Bootcamp.findById(bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id ${bootcampId} not found`, 400))
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a photo`, 400))
    }
  
    const file = req.files.file

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400))
    }
    
    if (file.size > process.env.MAX_UPLOAD_LIMIT) {
        return next(new ErrorResponse(`Please upload an image of size less than ${process.env.MAX_UPLOAD} bytes`, 400))
    }
    
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    console.log(file.name);

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err)
            return next(new ErrorResponse(`Some problem with file upload `,500))
        }
        
        const updatedBootcamp = await bootcamp.update({ photo : file.name})
        // const updatedBootcamp = await Bootcamp.findByIdAndUpdate(bootcampId, { photo: file.name }, {
        //     new: true,runValidators : true
        // })
        
        res.status(200).json({
            success: true,
            data: file.name
        })
    })

 })
