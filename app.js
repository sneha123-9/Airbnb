if(process.env.NODE_ENV!="production"){
require('dotenv').config();
};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl=process.env.ATLASDB_URL;

// Database
//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}
// View engine & static files
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=> {
  console.log("error in mongo session store",err)
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Demo user route (for testing only)
app.get("/demouser", async (req, res) => {
  const fakeuser = new User({
    email: "sneha@gmail.com",
    username: "sneha",
  });
  let registeredUser = await User.register(fakeuser, "helloworld");
  res.send(registeredUser);
});

// Routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Root route
// Root route
app.get("/", (req, res) => {
res.redirect("/listings");
});

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!.."));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!.." } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
  console.log("DB URL is:", dbUrl);
});
