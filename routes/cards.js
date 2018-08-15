const express = require('express');
const router = express.Router();

// Article Model
let Collection = require('../models/collection');
// User Model
let User = require('../models/user');

router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_card', {
        title: 'Add collection of cards',
        locale: req.i18n.getLocale()
    });
});

router.post('/add', function (req, res) {
    req.checkBody('colln', 'Collection name is required').notEmpty();
    req.checkBody('descr', 'Description is required').notEmpty();
    req.checkBody('front', 'Definition is required').notEmpty();
    req.checkBody('back', 'Explanation is required').notEmpty();
    req.checkBody('transl', 'Translation is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_card', {
            title: `Add collection of cards`,
            errors: errors,
            locale: req.i18n.getLocale()
        });
    } else {
        let collection = new Collection();
        collection.title = req.body.colln;
        collection.author = req.user._id;
        collection.description = req.body.descr;
        collection.cards.push({front: `${req.body.front}`, back: `${req.body.back}`, translation: `${req.body.transl}`});

        collection.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Card added to collection');
                res.redirect('/own');
            }
        });
    }
});
router.get('/editcard/:id', ensureAuthenticated, function(req, res){
    Collection.findOne({'cards._id': req.params.id},function(err,result){
        if(result.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        } else {
            let cid = req.params.id
            let card = result.cards.id(cid);
            res.render('edit_card', {
                title: 'Edit Card',
                card: card,
                locale: req.i18n.getLocale()

            });
        }
    });

});
// Update  single card  POST Route
router.post('/editcard/:id', function(req, res){
    Collection.findOne( { "cards._id": req.params.id }, function (err, collection){

            let card = collection.cards.id(req.params.id);
            card.front = req.body.front;
            card.back = req.body.back;
        card.translation = req.body.transl;
            collection.save();
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Card Updated');
                res.redirect('/cards/' + collection._id);
            }

        }

    );

});

//Add more cards GET route
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Collection.findById(req.params.id, function(err, card){
        if(card.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_collection', {
            title:`Add card to ${card.title} collection`,
            card: card,
            locale: req.i18n.getLocale()
        });
    });
});

//Add more cards to existing collection
router.post('/edit/:id', function(req, res){
    Collection.update({ _id: req.params.id},{ $push: { "cards": { front: `${req.body.front}`, back: `${req.body.back}`, translation: `${req.body.transl}` }
    } },function(err){
                if(err){
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'Card added to collection');
                    res.redirect('/cards/'+req.params.id);
                }
            });

   });

//Delete card
router.delete('/remove/:id', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }
    Collection.findOne({"cards._id": req.params.id}, function (err, collection) {
        if (collection.author != req.user._id) {
            res.status(500).send();
        } else {

            collection.cards.id(req.params.id).remove();
            collection.save();
            if (err) {
                console.log(err);

            }
            res.send('Success');
        }
    });

});
// Delete collection
 router.delete('/:id', function(req, res){
     if(!req.user._id){
        res.status(500).send();
     }

    let query = {_id:req.params.id};
     Collection.findById(req.params.id, function(err, coll){
        if(coll.author != req.user._id){
            res.status(500).send();
        } else {
            Collection.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});
//GET for single collection
router.get('/:id', function (req, res) {
    Collection.findById(req.params.id, function (err, collection) {
        User.findById(collection.author, function (err, user) {
            res.render('collection', {
                collection: collection,
                author: user.username,
                locale: req.i18n.getLocale()
            });
        });
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
