/*  @desc Get all bootcamps
    @route GET /api/v1/bootcamps
    @access Public
*/
exports.getAllBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg : "Show all bootcamps"
  });
}

/*  @desc Get bootcamp by id
    @route GET /api/v1/bootcamp/id
    @access Public
*/
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Show bootcamp ${req.params.id}`
  });
}

/*  @desc Create new bootcamp
    @route POST /api/v1/bootcamps
    @access Private
*/
exports.createBootcamp = (req, res, next) => {
    console.log(req.body)
    res.status(200).json({
        success: true,
        msg: `Created new bootcamp`
  });
}

/*  @desc Update bootcamp
    @route POST /api/v1/bootcamps/id
    @access Private
*/
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Updated bootcamp ${req.params.id}`
    })
}

/*  @desc Delete bootcamp
    @route POST /api/v1/bootcamps/id
    @access Private
*/
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Deleted bootcamp ${req.params.id}`
    })
}