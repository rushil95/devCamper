const User = require("../models/User")
const asyncHandler = require("../middleware/async")
/*
    @desc Register a user
    @route POST /api/v1/auth/register
    @acess PUBLIC
*/
exports.registerUser =  asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        password,
        email,    
        role
    })
    res.status(201).json({
        success: true,
        data: user
    })
})