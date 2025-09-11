const joi =require("joi");
module.exports.listingSchema= joi.object({
    listing :joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.allow("",null),
        country:joi.string().required(),
        location:joi.string().required(),
     }).required(),
});
// module.exports.reviewSchema= joi.object({
//     Review :joi.object({
//         comment:joi.string().required(),
//         rating:joi.number().required().min(1).max(5)
//     }).required(),
// });
module.exports.reviewSchema = joi.object({
  comment: joi.string().required(),
  rating: joi.number().required().min(1).max(5),
});


