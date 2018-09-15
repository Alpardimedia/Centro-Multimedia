'use strict'

var express = require('express');
var TemporadaController = require('../../controllers/series/temporada');
var api = express.Router();
var md_aut = require('../../middleware/autenticacion');

var multipart = require('connect-multiparty');
var md_subir = multipart({uploadDir: './subidas/series/temporadas'});

api.get('/temporada/:id', md_aut.ensureAut, TemporadaController.obtenerTemporada);
api.get('/temporadas/:serie?', md_aut.ensureAut, TemporadaController.obtenerTemporadas);
api.post('/temporada', md_aut.ensureAut, TemporadaController.guardarTemporada);
api.put('/temporada/:id', md_aut.ensureAut, TemporadaController.actualizarTemporada);
api.delete('/temporada/:id', md_aut.ensureAut, TemporadaController.eliminarTemporada);
api.post('/subir-imagen-temporada/:id', [md_aut.ensureAut, md_subir], TemporadaController.subirImagen);
api.get('/obtener-imagen-temporada/:archivoImagen', TemporadaController.obtenerArchivoImagen);

module.exports = api;