'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CancionSchema = Schema({
    numero: String,
    nombre: String,
    duracion: String,
    letra: String,
    archivo: String,
    disco: {type: Schema.ObjectId, ref: 'Disco'}
});

module.exports = mongoose.model('Cancion', CancionSchema);