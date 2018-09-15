'use strict'

var express = require('express');
var PeliculaController = require('../../controllers/peliculas/pelicula');
var api = express.Router();
var md_aut = require('../../middleware/autenticacion');

var multipart = require('connect-multiparty');
var md_subir_caratura = multipart({uploadDir: './subidas/peliculas/caraturas'});
var md_subir_pelicula = multipart({uploadDir: './subidas/peliculas/peliculas'});

api.get('/peliculas', md_aut.ensureAut, PeliculaController.obtenerPeliculas);
api.get('/pelicula/:id', md_aut.ensureAut, PeliculaController.obtenerPelicula);
api.post('/pelicula', md_aut.ensureAut, PeliculaController.guardarPelicula);
api.put('/pelicula/:id', md_aut.ensureAut, PeliculaController.actualizarPelicula);
api.delete('/pelicula/:id', md_aut.ensureAut, PeliculaController.eliminarPelicula);

api.post('/subir-caratura-pelicula/:id', [md_aut.ensureAut, md_subir_caratura], PeliculaController.subirCaratura);
api.get('/obtener-caratura-pelicula/:caratura_pelicula', PeliculaController.obtenerCaraturaPelicula);
api.post('/subir-pelicula/:id', [md_aut.ensureAut, md_subir_pelicula], PeliculaController.subirPelicula);
api.get('/obtener-archivo-pelicula/:archivo_pelicula', PeliculaController.obtenerArchivoPelicula);

module.exports = api;