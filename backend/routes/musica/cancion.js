'use strict'

var express = require('express');
var CancionController = require('../../controllers/musica/cancion');
var api = express.Router();
var md_aut = require('../../middleware/autenticacion');

var multipart = require('connect-multiparty');
var md_subir = multipart({uploadDir: './subidas/musica/canciones'});

api.get('/cancion/:id', md_aut.ensureAut, CancionController.obtenerCancion);
api.get('/canciones/:disco?', md_aut.ensureAut, CancionController.obtenerCanciones);
api.post('/cancion', md_aut.ensureAut, CancionController.guardarCancion);
api.put('/cancion/:id', md_aut.ensureAut, CancionController.actualizarCancion);
api.delete('/cancion/:id', md_aut.ensureAut, CancionController.eliminarCancion);
api.post('/subir-archivo-cancion/:id', [md_aut.ensureAut, md_subir], CancionController.subirArchivoCancion);
api.get('/obtener-archivo-cancion/:archivoAudio', CancionController.obtenerArchivoCancion);

module.exports = api;