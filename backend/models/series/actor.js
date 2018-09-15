'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActorSerieSchema = Schema({
    nombre: String,
    nacimiento: String,
    biografia: String,
    imagen: String,
    serie: {type: Schema.ObjectId, ref: 'Serie'}
});

module.exports = mongoose.model('Actor', ActorSerieSchema);