const express = require('express');
const router = express.Router();

// Article Model
let Card = require('../models/card');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_card', {
        title:'Add card'
    });
});

// Add Submit POST Route
router.post('/add', function(req, res){
    req.checkBody('front','Definition is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('back','Explanation is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_card', {
            title:'Add card',
            errors:errors
        });
    } else {
        let card = new Card();
        card.front = req.body.front;
        card.author = req.user._id;
        card.back = req.body.back;
        card.colln = req.body.colln;

        card.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                req.flash('success','Card Added');
                res.redirect('/');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Card.findById(req.params.id, function(err, card){
        if(card.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_card', {
            title:'Edit Card',
            card: card
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
    let card = {};
    card.front = req.body.front;
    card.author = req.user._id;
    card.back = req.body.back;
    card.colln = req.body.colln;

    let query = {_id:req.params.id}

    Card.update(query, card, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            req.flash('success', 'Card Updated');
            res.redirect('/');
        }
    });
});

// Delete Article
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id}

    Card.findById(req.params.id, function(err, card){
        if(card.author != req.user._id){
            res.status(500).send();
        } else {
            Card.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

// Get Single Article
router.get('/:id', function(req, res){
    Card.findById(req.params.id, function(err, card){
        User.findById(card.author, function(err, user){
            res.render('card', {
                card: card,
                author: user.username
            });
        });
    });
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
