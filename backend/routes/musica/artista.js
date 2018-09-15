'use strict'

var express = require('express');
var ArtistaController = require('../../controllers/musica/artista');
var api = express.Router();
var md_aut = require('../../middleware/autenticacion');

var multipart = require('connect-multiparty');
var md_subir = multipart({uploadDir: './subidas/musica/artistas'});

api.get('/artista/:id', md_aut.ensureAut, ArtistaController.obtenerArtista);
api.get('/artistas/', md_aut.ensureAut, ArtistaController.obtenerArtistas);
api.post('/artista', md_aut.ensureAut, ArtistaController.guardarArtista);
api.put('/artista/:id', md_aut.ensureAut, ArtistaController.actualizarArtista);
api.delete('/artista/:id', md_aut.ensureAut, ArtistaController.eliminarArtista);
api.post('/subir-imagen-artista/:id', [md_aut.ensureAut, md_subir], ArtistaController.subirImagen);
api.get('/obtener-imagen-artista/:archivoImagen', ArtistaController.obtenerArchivoImagen);

module.exports = api;