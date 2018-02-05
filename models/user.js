const mongoose = require("mongoose");
//encryption package for user info
const bcrypt = require("bcryptjs");
const config = require("../config/database");

const userSchema = mongoose.Schema({
  name:{
    type: String
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});

//ALLOWS US TO CALL USER, FIND USER BY ID AND USERNAME FROM OUTSIDE THE FILE
const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
};
module.exports.getUserByUsername = function(username, callback){
  const query = {username: username};
  User.findOne(query, callback);
};

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) =>{
    bcrypt.hash(newUser.password, salt, (err, hash) =>{
      newUser.password = hash;
      newUser.save(callback);
    }
    )
  })
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
  if(err){
    console.log(err)
  }
  callback(null, isMatch);
})
}
