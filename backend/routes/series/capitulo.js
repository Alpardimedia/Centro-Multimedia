'use strict'

var express = require('express');
var CapituloController = require('../../controllers/series/capitulo');
var api = express.Router();
var md_aut = require('../../middleware/autenticacion');

var multipart = require('connect-multiparty');
var md_subir = multipart({uploadDir: './subidas/series/capitulos'});

api.get('/capitulo/:id', md_aut.ensureAut, CapituloController.obtenerCapitulo);
api.post('/capitulo', md_aut.ensureAut, CapituloController.guardarCapitulo);
api.get('/capitulos/:temporada?', md_aut.ensureAut, CapituloController.obtenerCapitulos);
api.put('/capitulo/:id', md_aut.ensureAut, CapituloController.actualizarCapitulo);
api.delete('/capitulo/:id', md_aut.ensureAut, CapituloController.eliminarCapitulo);
api.post('/subir-archivo-capitulo/:id', [md_aut.ensureAut, md_subir], CapituloController.subirArchivoVideo);
api.get('/obtener-archivo-capitulo/:archivoVideo', CapituloController.obtenerArchivoVideo);

module.exports = api;