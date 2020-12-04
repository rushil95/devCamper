const { find, findByIdAndUpdate } = require("../models/Bootcamp")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/ErrorResponse")
const asyncHandler = require("../middleware/async")
const geocoder = require("../utils/Geocoder")


/*  @desc Get all bootcamps
    @route GET /api/v1/bootcamps
    @access Public
*/
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {

        console.log(req.query)
        const bootcamps = await Bootcamp.find(req.query)
        res.status(200).json({
        success: true,
        count: bootcamps.length,
        data : bootcamps
        })

})

/*  @desc Get bootcamp by id
    @route GET /api/v1/bootcamp/id
    @access Public
*/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
   
   
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Resource with ID ${req.params.id} not found`, 404))
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })

})

/*  @desc Create new bootcamp
    @route POST /api/v1/bootcamps
    @access Private
*/
exports.createBootcamp =asyncHandler( async (req, res, next) => {
    
  
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json(bootcamp)
      
})

/*  @desc Update bootcamp
    @route POST /api/v1/bootcamps/id
    @access Private
*/
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!bootcamp) {
            return res.status(400).json({
                success : false
            });
        }
        res.status(200).json({
          bootcamp  
        })
})

/*  @desc Delete bootcamp
    @route POST /api/v1/bootcamps/id
    @access Private
*/
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if (!bootcamp) {
            return res.status(400).json({
                success : false
            });
        }
        res.status(200).json({
            success: true,
          data: {}  
        })
   
})

/* @desc Get bootcamps within a radius of 
   @route GET /api/v1/bootcamps/:zipcode/:distance
   @access Public
 */
exports.getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    const loc = await geocoder.geocode(zipcode)
    const latitude = loc[0].latitude
    const longitude = loc[0].longitude

    //get radius in radians
    //divide distance by earth's radius
    const radius = distance / 3959
    const bootcamps = await Bootcamp.find({
        location :  {
            $geoWithin: { $centerSphere: [ [ longitude, latitude ], radius ] }
         }
    })
    res.status(200).json({
        success: true,
        count : bootcamps.length,
        data : { bootcamps }
    })
})