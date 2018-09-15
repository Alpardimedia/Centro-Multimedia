'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar rutas

// Usuarios
var usuario_rutas = require('./routes/usuario');

// Series
var actor_rutas = require('./routes/series/actor');
var serie_rutas = require('./routes/series/serie');
var temporada_rutas = require('./routes/series/temporada');
var capitulo_rutas = require('./routes/series/capitulo');

// Musica
var artista_rutas = require('./routes/musica/artista');
var album_rutas = require('./routes/musica/album');
var disco_rutas = require('./routes/musica/disco');
var cancion_rutas = require('./routes/musica/cancion');

// Peliculas
var pelicula_rutas = require('./routes/peliculas/pelicula');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configura las cabeceras Http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

// Rutas base

// Usuarios
app.use('/api', usuario_rutas);

// Series
app.use('/api', actor_rutas);
app.use('/api', serie_rutas);
app.use('/api', temporada_rutas);
app.use('/api', capitulo_rutas);

// Musica
app.use('/api', artista_rutas);
app.use('/api', album_rutas);
app.use('/api', disco_rutas);
app.use('/api', cancion_rutas);

// Peliculas
app.use('/api', pelicula_rutas);

module.exports = app;