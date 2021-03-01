const Joi = require('joi');

module.exports.swimholeSchema = Joi.object({
    swimhole: Joi.object({
        title: Joi.string().required(),
        //image: Joi.string().required(),
        price: Joi.string().required().min(0),
        description: Joi.string().required(),
        location: Joi.string(),
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number(),
        body: Joi.string().required()
    }).required()
})