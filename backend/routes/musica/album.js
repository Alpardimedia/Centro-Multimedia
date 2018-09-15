'use strict'

var express = require('express');
var AlbumController = require('../../controllers/musica/album');
var api = express.Router();
var md_aut = require('../../middleware/autenticacion');

var multipart = require('connect-multiparty');
var md_subir = multipart({uploadDir: './subidas/musica/albums'});

api.get('/album/:id', md_aut.ensureAut, AlbumController.obtenerAlbum);
api.get('/albums/:artista?', md_aut.ensureAut, AlbumController.obtenerAlbums);
api.post('/album', md_aut.ensureAut, AlbumController.guardarAlbum);
api.put('/album/:id', md_aut.ensureAut, AlbumController.actualizarAlbum);
api.delete('/album/:id', md_aut.ensureAut, AlbumController.eliminarAlbum);
api.post('/subir-imagen-album/:id', [md_aut.ensureAut, md_subir], AlbumController.subirImagen);
api.get('/obtener-imagen-album/:archivoImagen', AlbumController.obtenerArchivoImagen);

module.exports = api;