'use strict'

var express = require('express');
var ActorController = require('../../controllers/series/actor');
var api = express.Router();
var md_aut = require('../../middleware/autenticacion');

var multipart = require('connect-multiparty');
var md_subir = multipart({uploadDir: './subidas/series/actores'});

api.get('/actor/:id', md_aut.ensureAut, ActorController.obtenerActor);
api.get('/actores-serie/', md_aut.ensureAut, ActorController.getActores);
api.post('/actor', md_aut.ensureAut, ActorController.guardarActor);
api.get('/actores/:serie', md_aut.ensureAut, ActorController.obtenerActores);
api.put('/actor/:id', md_aut.ensureAut, ActorController.actualizarActor);
api.delete('/actor/:id', md_aut.ensureAut, ActorController.eliminarActor);
api.post('/subir-imagen-actor/:id', [md_aut.ensureAut, md_subir], ActorController.subirImagen);
api.get('/obtener-imagen-actor/:archivoImagen', ActorController.obtenerArchivoImagen);

module.exports = api;