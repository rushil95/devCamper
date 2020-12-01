const { find, findByIdAndUpdate } = require("../models/Bootcamp")
const Bootcamp = require("../models/Bootcamp")

/*  @desc Get all bootcamps
    @route GET /api/v1/bootcamps
    @access Public
*/
exports.getAllBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json(bootcamps)
    }
    catch (err) {
        res.status(400).json({success: false})
    }
}

/*  @desc Get bootcamp by id
    @route GET /api/v1/bootcamp/id
    @access Public
*/
exports.getBootcamp = async (req, res, next) => {
   
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp) {
            return res.status(400).json({success: false})
        }
        res.status(200).json(bootcamp)

    } catch (err) {
        console.log(err)
        res.status(400).json({success: false})
    }
}

/*  @desc Create new bootcamp
    @route POST /api/v1/bootcamps
    @access Private
*/
exports.createBootcamp = async (req, res, next) => {
    console.log(req.body)
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json(bootcamp)
    } catch (error) {
        res.status(400).json({
            success : false
        })
    }    
}

/*  @desc Update bootcamp
    @route POST /api/v1/bootcamps/id
    @access Private
*/
exports.updateBootcamp = async (req, res, next) => {
    try {
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
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false
        });
    }
}

/*  @desc Delete bootcamp
    @route POST /api/v1/bootcamps/id
    @access Private
*/
exports.deleteBootcamp = async (req, res, next) => {
    try {
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
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false
        });
    }
}