const express = require('express');
const router = express.Router();

// Article Model
let Collection = require('../models/collection');
// User Model
let User = require('../models/user');

router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_card', {

        locale: req.i18n.getLocale()
    });
});

router.post('/add', function (req, res) {
    req.checkBody('colln', 'Поле "Название коллекции" должно быть заполнено').notEmpty();
    req.checkBody('descr', 'Поле "Описание коллекции" должно быть заполнено').notEmpty();
    req.checkBody('front', 'Поле "Понятие" должно быть заполнено').notEmpty();
    req.checkBody('back', 'Поле "Определение" должно быть заполнено').notEmpty();
    req.checkBody('transl', 'Поле "Перевод" должно быть заполнено').notEmpty();
    req.checkBody('exmpl', 'Поле "Пример" должно быть заполнено').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_card', {

            errors: errors,
            locale: req.i18n.getLocale()
        });
    } else {
        let collection = new Collection();
        collection.title = req.body.colln;
        collection.author = req.user._id;
        collection.description = req.body.descr;
        collection.cards.push({front: `${req.body.front}`, back: `${req.body.back}`, translation: `${req.body.transl}`, example: `${req.body.exmpl}`});

        collection.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Карточка добавлена в коллекцию');
                res.redirect('/own');
            }
        });
    }
});
router.get('/editcard/:id', ensureAuthenticated, function(req, res){
    Collection.findOne({'cards._id': req.params.id},function(err,result){
        if(result.author != req.user._id){
            req.flash('danger', 'Вы не авторизованы');
            res.redirect('/');
        } else {
            let cid = req.params.id
            let card = result.cards.id(cid);
            res.render('edit_card', {

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
        card.example = req.body.exmpl;
            collection.save();
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Карточка отредактирована');
                res.redirect('/cards/' + collection._id);
            }

        }

    );

});

//Add more cards GET route
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Collection.findById(req.params.id, function(err, card){
        if(card.author != req.user._id){
            req.flash('danger', 'Вы не авторизованы');
            res.redirect('/');
        }
        res.render('edit_collection', {

            card: card,
            locale: req.i18n.getLocale()
        });
    });
});

//Add more cards to existing collection
router.post('/edit/:id', function(req, res){
    Collection.update({ _id: req.params.id},{ $push: { "cards": { front: `${req.body.front}`, back: `${req.body.back}`, translation: `${req.body.transl}`,
                example: `${req.body.exmpl}` }
    } },function(err){
                if(err){
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'Карточка добавлена в коллекцию');
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
        req.flash('danger', 'Пожалуйста, выполните вход');
        res.redirect('/users/login');
    }
}

module.exports = router;
