'use strict'

var express = require('express');
var SerieController = require('../../controllers/series/serie');
var api = express.Router();
var md_aut = require('../../middleware/autenticacion');

var multipart = require('connect-multiparty');
var md_subir = multipart({uploadDir: './subidas/series/portadas'});

api.get('/serie/:id', md_aut.ensureAut, SerieController.obtenerSerie);
api.post('/serie', md_aut.ensureAut, SerieController.guardarSerie);
api.get('/series/:actor?', md_aut.ensureAut, SerieController.obtenerSeries);
api.get('/actor/:id', md_aut.ensureAut, SerieController.getSeries);
api.put('/serie/:id', md_aut.ensureAut, SerieController.actualizarSerie);
api.delete('/serie/:id', md_aut.ensureAut, SerieController.eliminarSerieActor);
api.post('/subir-imagen-serie/:id', [md_aut.ensureAut, md_subir], SerieController.subirImagen);
api.get('/obtener-imagen-serie/:archivoImagen', SerieController.obtenerArchivoImagen);

module.exports = api;