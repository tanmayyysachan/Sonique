const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use('/songs', express.static(path.join(__dirname, 'song')));
const session=require("express-session");
const User = require('./models/user.js'); 
const song = require('./models/song.js');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const wrapAsync = require("./public/util/WrapAsync.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wavetune";
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=> {
    console.log(err)});
// main fxn to connect to DB
async function main() {
    await mongoose.connect(MONGO_URL);
}
const sessionOptions={
    secret:"BMSCE",
    resave:false,
    saveUninitialized: true,
    Cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
        
    },
};
app.use(session(sessionOptions));
app.use(express.json()); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// signup
app.post("/signup",wrapAsync(async(req,res)=>{
    let { username,email,password}=req.body;
    const newuser=new User({username,email,password});
    const registereduser=await User.register(newuser,password);
    console.log(registereduser);
    res.redirect("/index");
}));
app.get("/signup",(req,res)=>{
    res.render("../views/signup.ejs")
})
app.post("/login",passport.authenticate('local',
    { failureRedirect: '/login' }),async(req,res)=>{
        res.redirect("/index");
})
app.get("/login",(req,res)=>{
    res.render("../views/login.ejs");
})
app.get("/logout",(req,res)=>{
    res.redirect('/');
})
app.get("/",(req,res)=>{
    res.render("../views/home.ejs");
})
app.get("/index",async(req,res)=>{
    const songs = await song.find({});
    res.render("../views/index.ejs",{songs});
})
app.get("/sub",async(req,res)=>{
    res.render("../views/sub.ejs");
})
app.get("/song/:id",async(req,res)=>{
    let {id}=req.params;
    const list= await song.findById(id);
    res.render("../views/song.ejs",{list})
})


app.listen(8080,()=>{
    console.log("server is running");
})
