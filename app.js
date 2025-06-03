if(process.env.NODE_ENV != 'production'){
require('dotenv').config()
// console.log(process.env);
}

const express = require("express")
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Model/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

const dbUrl = process.env.ATLAS_URL || 'mongodb://127.0.0.1:27017/DreamPlace';


//Create MongoStore for Session :
const store = MongoStore.create({
   mongoUrl: dbUrl,
   crypto:{
        secret: "secret-code",
   },
   touchAfter: 24 * 60 * 60 // 24 hours
})

// Error for Session Store :
store.on("error", () => {
   console.log("Session Store Error", err);
})


//Create Session options : 
// Also Define cookie for expires and login :
const sessionOptions = {
   store,
   secret: "secret-code",
   resave:false,
   saveUninitialized: true,
   cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
   },
}

app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate() ));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Connect Db for Mongoose :
main().then(() => {
   console.log("DBS is Connected");
})
   .catch(err => console.log(err));

async function main() {
   await mongoose.connect(dbUrl)
}


// Set View Engine for ejs file : 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Use MiddleWare for get Data from data.js file : 
app.use(express.urlencoded({ extended: true }));

// For Method Put and Delete instead of Post : 
app.use(methodOverride("_method"));

//FOr USe Static File like CSS;
app.use(express.static(path.join(__dirname, "/public")))

//For Ejs-Mate Make : 
app.engine('ejs', ejsMate)

// app.get("/", (req, res) => {
//    res.send("I am A Root")
// })

// Middleware for Flash Msg : 
app.use((req, res, next) => {
   res.locals.added = req.flash("added")
   res.locals.error = req.flash("error")
   res.locals.currUser = req.user;
   next()
}) ;

// Use for /listings route from Route folder:
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", usersRouter)


//For Error Route for Backend : 
app.use((err, req, res, next) => {
   let { statusCode = 500, message = "Something went worng" } = err;
   // res.status(statusCode).send(message);
   res.status(statusCode).render("error.ejs", {err})
})


app.listen(8080, () => {
   console.log("Server Is Started");
})

// New Route for User : 
// app.get("/registerUser", async (req, res) => {
//     let fakeUser = new User({
//        email:"ashishnagar0405@gmail.com",
//        username:"Nagar-Ashish"
//     })    
//     // pass user to show register form:
//    let newUser = await User.register(fakeUser, "ashish0405")
//    res.send(newUser)
// })

// app.get("/testListing", async (req, res) => {
//   let SL = new Listing({
//     title: "My New Villa",
//     des : "Near the Beach",
//     price : 1200,
//     location:"Mumbai, Nikol",
//     country: "India"
//   })

//   await SL.save();
//   console.log("Sample was Saved");
//   res.send("Successful testing")
// })

// For all link worng link/
// app.all("*", (req, res, next) => {
//    next( new ExpressError(404, "Page Not Found"))
   
// });

