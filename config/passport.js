//imported from passport-jwt docs
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload)
    User.getUserById(jwt_payload.data._id, (err, user) => {
      if(err){
        return (err, false)
      }

      if(user){
        return done(null, user);
      }
      else{
        return done(null, false)
      }
    })
  })
)}
