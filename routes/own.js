const express = require('express');
const router = express.Router();

// Article Model
let Collection = require('../models/collection');
// User Model
let User = require('../models/user');

router.get('/',ensureAuthenticated, function (req, res) {
    Collection.find({'author':req.user._id}, function (err, cards) {

            if (err) {
                console.log(err);
            } else {

                res.render('own', {
                    cards: cards,
                    locale: req.i18n.getLocale()

                });
            }
        });

});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;