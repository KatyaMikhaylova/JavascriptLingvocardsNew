let mongoose = require('mongoose');

// Article Schema
let collectionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cards: [{
        front: String,
        back:  String,
        translation: String

    }]

});
let Collection = module.exports = mongoose.model('Collection', collectionSchema);