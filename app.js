if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require("express-session")
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const multer = require("multer");
const upload = multer({dest : 'uploads/'});

const  listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

const dbURL = process.env.ATLASDB_URI ;

main()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(methodOverride('_method')); // for PUT and DELETE requests
app.engine('ejs', ejsMate); // to use ejs-mate for layout support
app.use(express.static(path.join(__dirname, 'public'))); // to serve static files

const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 3600, // time in seconds
  crypto: {
    secret : process.env.SECRET,
  },
});
store.on("error",()=>{
  console.log("ERROR in MONGO STORE",err);
});
const sessionOptions = {
  store,
  secret :process.env.SECRET,
  resave : false ,
  saveUninitialized : true,
  cookie:{
    expires : Date.now() + 7*24*60*60*1000,   // time in milli seconds
    maxAge :  7*24*60*60*1000,
    httpOnly : true,
  },
};



// app.get('/', (req, res) => {
//   res.send('Hi, i am root');
// });


app.use(session(sessionOptions));
app.use(flash());


//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


//demo for sigup user
// app.get("/demoUser",async (req,res) => {
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username : "delta-schema",
//   });
//   let registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);

// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get('/testListing',async (req, res) => {
//     let sampleListing = new listing({
//         title: 'My new Villa',
//         description: 'By the beach',
//         price: 10000,
//         location: 'Mawana',
//         country: 'India'
//     });
//     await sampleListing.save();
//     console.log('Sample listing saved:');
//     res.send('Successfully saved sample listing');

// });


app.all('/{*splat}', (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).json({ error: message });
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { err });
});



app.listen(8080, () => {
  console.log('Server is running on port 8080');
});