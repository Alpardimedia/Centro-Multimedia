'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PeliculaSchema = Schema({
    titulo: String,
    ano: String,
    duracion: String,
    pais: String,
    director: String,
    guionista: String,
    compositor: String,
    fotografo: String,
    reparto: String,
    productor: String,
    genero: String,
    sinopsis: String,
    caratura: String,
    archivo: String
});

module.exports = mongoose.model('Pelicula', PeliculaSchema);