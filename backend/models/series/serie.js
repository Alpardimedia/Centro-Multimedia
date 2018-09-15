'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SerieSchema = Schema({
    titulo: String,
    ano: String,
    sinopsis: String,
    imagen: String,
    actor: {type: Schema.ObjectId, ref: 'Actor'}
});

module.exports = mongoose.model('Serie', SerieSchema);