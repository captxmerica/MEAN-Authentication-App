const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
//confgures allowed view types
const cors = require("cors");
//user auth package
const passport = require("passport");
//setting up our database
const mongoose = require("mongoose");
const config = require('./config/database');
//db url defined in donfig object
mongoose.connect(config.database);
//Tells us we're connected to db or error
mongoose.connection.on('connected', () => {
  console.log("connected to " + config.database);
});
mongoose.connection.on('error', (err) => {
  console.log("error: " + err);
});

const app = express();

const users = require('./routes/users');
const port = 3000;

//CORS MIDDLEWARE
app.use(cors());

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

//BODYPARSER MIDDLEWARE
app.use(bodyParser.json());

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session())
require('./config/passport')(passport);

//ALLOWS EXPRESS TO GET ROUTES FROM ROUTES/USERS.JS

app.use("/users", users);

//Index Route
app.get("/", function(req, res){
    res.send('invaild endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Start Server
app.listen(port, () =>{
  console.log("MEAN Server Started");
})
