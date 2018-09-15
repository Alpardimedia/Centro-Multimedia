'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemporadaSchema = Schema({
    numero: String,
    lanzamiento: String,
    imagen: String,
    serie: {type: Schema.ObjectId, ref: 'Serie'}
});

module.exports = mongoose.model('Temporada', TemporadaSchema);