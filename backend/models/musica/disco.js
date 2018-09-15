'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiscoSchema = Schema({
    numero: Number,
    album: {type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Disco', DiscoSchema);