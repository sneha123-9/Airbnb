const express=require("express");
const app= express();
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const Listing= require("../models/listing.js");
const {isLoggedIn, isOwner, saveRedirectUrl,validateListing}=require("../middleware.js")
const listingController=require("../controller/listings.js");
const multer  = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage });

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,saveRedirectUrl, validateListing,upload.single('listing[image]'),wrapAsync (listingController.createListing));


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,validateListing,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync (listingController.renderEditForm));

module.exports=router;