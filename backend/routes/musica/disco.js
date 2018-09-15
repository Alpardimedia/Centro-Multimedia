'use strict'

var express = require('express');
var DiscoController = require('../../controllers/musica/disco');
var api = express.Router();
var md_aut = require('../../middleware/autenticacion');

api.get('/disco/:id', md_aut.ensureAut, DiscoController.obtenerDisco);
api.get('/discos/:album?', md_aut.ensureAut, DiscoController.obtenerDiscos);
api.post('/disco', md_aut.ensureAut, DiscoController.guardarDisco);
api.put('/disco/:id', md_aut.ensureAut, DiscoController.actualizarDisco);
api.delete('/disco/:id', md_aut.ensureAut, DiscoController.eliminarDisco);

module.exports = api;