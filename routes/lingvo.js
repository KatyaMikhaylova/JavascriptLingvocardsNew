const express = require('express');
const router = express.Router();

// Article Model
let Collection = require('../models/collection');

let User = require('../models/user');


router.get('/:id', function (req, res) {
    Collection.findById(req.params.id, function (err, collection) {
        User.findById(collection.author, function (err, user) {
            res.render('lingvo', {
                collection: collection,
                author: user.username,
                locale: req.i18n.getLocale()
            });

        });
    });
});
router.get('/getdata/:id', function (req, res) {
    Collection.findById(req.params.id, function (err, collection) {
        res.json(collection);
    });
});
module.exports = router;