


// // create a comment
// parent.children.push({ name: 'Liesl' });
// var subdoc = parent.children[0];
// console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
// subdoc.isNew; // true
//
// parent.save(function (err) {
//     if (err) return handleError(err)
//     console.log('Success!');
// });

const express = require('express');
const router = express.Router();

// Article Model
let Collection = require('../models/collection');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_collection', {
        title:'Add collection'
    });
});
router.post('/add', function(req, res){
    req.checkBody('colln','Collection is required').notEmpty();


    // Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_collection', {
            title:'Add collection',
            errors:errors
        });
    } else {
        let ctitle = req.body.colln;
        res.redirect(`/cards/:${ctitle}`);
    }
});
// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;

// req.checkBody('front','Definition is required').notEmpty();
// //req.checkBody('author','Author is required').notEmpty();
// req.checkBody('back','Explanation is required').notEmpty();
// let collection = new Collection();
// collection.title = req.body.colln;
// collection.author = req.user._id;
// collection.cards.push( {front:`${req.body.front}`, back:`${req.body.back}`});
//
//
// collection.save(function(err){
//     if(err){
//         console.log(err);
//         return;
//     } else {
//         console.log(collection);
//         req.flash('success','Card Added');
//         res.redirect('/collections');
//     }
// });