//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const user1 =new User({
    email:req.body.username,
    password:req.body.password
  });
  user1.save(function(err){
    if(!err){
        res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username1=req.body.username;
  const password1=req.body.password;
  User.findOne({email:username1},function(err,found){
    if(!found){
      console.log("Sorry please register");
    }else{
      if(found){
        if(found.password===password1){
          res.render("secrets");
        }else{
          console.log("incorrect password");
        }
      }
    }
  });
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});
