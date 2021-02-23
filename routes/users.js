const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs');
const passport= require('passport');

 const User = require('../models/User');

 const {forwardAuthenticated} = require('../config/auth');
//login page
router.get('/login',(req,res)=> res.render('login'));

//register
router.get('/Register',(req,res)=> res.render('register'));

router.post('/register',(req,res)=>{
    const {name,email,password } = req.body;
    let errors=[];

if (!name || !email || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }
else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          name,
          email,
          password
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10,(err,salt)=>{
          bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password=hash;
            newUser
              .save()
              .then(user=>{
                req.flash(
                  'success_msg',
                  'You are now registered and can login in'
                );
                res.redirect('/login');
              })
              .catch(err=>console.log(err));
          })
        })
      }
    });
}
});
//login handle
router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirec: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req,res,next);
});

//logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;