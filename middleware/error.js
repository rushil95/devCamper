const ErrorResponse = require("../utils/ErrorResponse")

const errorHandler = (err, req, res, next) => {
    console.log(err.code, err.name)
    console.log(err.stack.red.inverse)
    

    let error = { ...err }
    error.message = err.message

    //Code 11000 Duplicate entry
    if (err.code === 11000) {
        error = new ErrorResponse(`Duplicate entry`,400)
    }

    //Mongoose invalid ID error
    if (err.name === "CastError") {
        error = new ErrorResponse(`Resource with ID ${error.value} not found`,404)
    }

    //Validation errors
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error : error.message || "Server Error"
    })
}

module.exports = errorHandler
