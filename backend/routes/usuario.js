'use strict'

var express = require('express');
var UsuarioController = require('../controllers/usuario');

var api = express.Router();
var md_aut = require('../middleware/autenticacion');

var multipart = require('connect-multiparty');
var md_subir = multipart({uploadDir: './subidas/usuarios'});

api.post('/registro', UsuarioController.saveUsuario);
api.post('/login', UsuarioController.loginUsuario);
api.put('/actualizar-usuario/:id', md_aut.ensureAut, UsuarioController.actualizarUsuario);
api.post('/subir-imagen-usuario/:id', [md_aut.ensureAut, md_subir], UsuarioController.subirImagen);
api.get('/obtener-imagen-usuario/:archivoImagen', UsuarioController.obtenerArchivoImagen);

module.exports = api;