const { response } = require("express");

const advancedResult = (model, populate) => async(req, res, next) => {
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
    query = model.find(JSON.parse(queryStr)).populate(populate);

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
    const limit = parseInt(req.query.limit,10) || 15;

    const skip = (page - 1) * limit;
    const startIndex = skip;
    const endIndex = skip + limit;

    const totalDocs = await model.countDocuments();
    let pagination = {};
    if (skip > 0) pagination.prev = page - 1;
    console.log(totalDocs,endIndex)
    if (totalDocs > endIndex) pagination.next = page + 1;

    query.skip(skip).limit(limit);
    const result = await query;

    res.advancedResult = {
        success: true,
        count: result.length,
        pagination: pagination,
        data: result
    }
    next()
}

module.exports = advancedResult