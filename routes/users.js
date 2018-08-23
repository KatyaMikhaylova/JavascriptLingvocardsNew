const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){

  res.render('register', {
    //locale: req.i18n.getLocale()
 });
});

// Register Proccess
router.post('/register', function(req, res){

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
console.log(username);
  req.checkBody('username', 'Имя пользователя является обязательным полем').notEmpty();
  req.checkBody('email', 'Email является обязательным полем').notEmpty();
  req.checkBody('email', 'Email не соответствует условиям').isEmail();
  req.checkBody('password', 'Поле с паролем должно быть заполнено').notEmpty();
  req.checkBody('password2', 'Пароли не совпадают').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
        //locale: req.i18n.getLocale()
    });
  } else {
    let newUser = new User({
        username:username,
      email:email,

      password:password
    });
console.log(newUser);
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','Вы зарегистрировались и можете выполнить вход');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('login', { locale: req.i18n.getLocale() });
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Вы вышли из системы');
  res.redirect('/users/login');
});

module.exports = router;
