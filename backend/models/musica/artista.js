'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistaSchema = Schema({
    nombre: String,
    biografia: String,
    nacimiento: String,
    imagen: String
});

module.exports = mongoose.model('Artista', ArtistaSchema);