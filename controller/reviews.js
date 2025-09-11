const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
module.exports.createReview=async(req,res)=>{
        let listing=await Listing.findById(req.params.id);
        let newReview = new Review({...req.body.review, author:req.user._id});
        newReview.author=req.user._id;
        listing.reviews.push(newReview);
        console.log(newReview);
        await newReview.save();
        await listing.save();
        console.log("review was saved");
        req.flash("success","New Review created !");
        res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   let deletedlisting= await Review.findByIdAndDelete(reviewId);
   console.log(deletedlisting);
   req.flash("success","Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);

};