'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CapituloSchema = Schema({
    numero: String,
    titulo: String,
    duracion: String,
    sinopsis: String,
    archivo: String,
    temporada: {type: Schema.ObjectId, ref: 'Temporada'}
});

module.exports = mongoose.model('Capitulo', CapituloSchema);