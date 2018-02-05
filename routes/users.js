const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config  = require("../config/database")

//Register
router.post('/register', (req, res, next) =>{
  //create new user
  let newUser = new User({
  name: req.body.name,
  email: req.body.email,
  username: req.body.username,
  password: req.body.password
});
User.addUser(newUser, (err, user) =>{
  if(err){
  res.json({success: false, msg: 'Failed to Register User'});
} else{
    res.json({success: true, msg: 'User registered successfully'});
}
})
});

router.post('/authenticate', (req, res, next) =>{
const username = req.body.username;
const password = req.body.password;

User.getUserByUsername(username, (err, user) => {
  if(!user){
    return res.json({success: false, msg: 'User not found'});
  }
  User.comparePassword(password, user.password, (err, isMatch) =>{
    if(err){
      console.log(err);
    } else
    if(isMatch){
      const token = jwt.sign({data: user}, config.secret, {
      expiresIn: 604800 // 1 week;
    });

    res.json({
      success: true,
      token: 'Bearer '+token,
      user:{
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    })
    }
    else{
      return res.json({success: false, msg: "Wrong Password"})
    }
  })
})
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) =>{
res.json({user: req.user});
});

// router.get('/validate', function(req, res){
// res.send("VALIDATE");
// });

module.exports= router;
