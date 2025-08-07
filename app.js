const express=require("express");
const app= express();
const mongoose =require("mongoose");
const path = require("path");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const Listing= require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

app.use(methodOverride("_method"));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
};
//Index Route
app.get("/listings",async(req,res)=>{
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}= req.params;
   let listing = await Listing.findById(id);
   res.render("listings/show.ejs",{listing});
});
//create route
app.post("/listings",async(req,res)=>{
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
   let listing= await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
});
//Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect("/listings")

});
//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
   let deleted= await Listing.findByIdAndDelete(id);
   console.log(deleted);
   res.redirect("/listings");

});

// app.get("/testlisting",async(req,res)=>{
//     let samplelisting = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangut,Goa",
//         country:"India",
// });
app.get("/",(req,res)=>{
    res.send("root is working");
});
app.listen("3000",()=>{
    console.log("listening on port 3000");
}); 