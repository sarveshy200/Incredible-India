const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        categories: Joi.array().items(Joi.string().hex().length(24)).required()
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required(),
});


module.exports.bookNowSchema = Joi.object({
  booking: Joi.object({
    name: Joi.string().trim().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().label("Phone"),
    address: Joi.string().required().label("Address"),
    members: Joi.number().integer().min(1).required().label("Members"),

    memberNames: Joi.alternatives()
      .try(
        Joi.array().items(Joi.string().required()).min(1),
        Joi.string().required()
      )
      .required()
      .label("Member Names"),

    date: Joi.date().greater('now').required().label("Booking Date")
  }).required()
});

