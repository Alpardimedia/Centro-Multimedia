'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artista = require('../../models/musica/artista');
var Album = require('../../models/musica/album');
var Disco = require('../../models/musica/disco');
var Cancion = require('../../models/musica/cancion');

function obtenerDisco(req, res){
    var discoId = req.params.id;

    Disco.findById(discoId).populate({path: 'album', populate: {path: 'artista', model: 'Artista'}}).exec((err, disco) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!disco){
                res.status(404).send({mensaje: 'No hay discos en este album'});
            }else{
                res.status(200).send({disco});
            }
        }
    });
}

function obtenerDiscos(req, res){
    var albumId = req.params.album;

    if(!albumId){
        var buscar = Disco.find({}).sort('numero');
    }else{
        var buscar = Disco.find({album: albumId}).sort({'numero': 1});
        var buscarAlbum = Album.find({album: albumId}).sort({'titulo': 1});
    }

    buscar.populate({path: 'album', populate: {path: 'artista', model: 'Artista'}}).exec((err, discos) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!discos){
                res.status(404).send({mensaje: 'No hay discos'});
            }else{
                res.status(200).send({discos});
            }
        }
    });
}

function guardarDisco(req, res){
    var disco = new Disco();

    var parametros = req.body;

    disco.numero = parametros.numero;
    disco.album = parametros.album;

    disco.save((err, discoGuardado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!discoGuardado){
                res.status(404).send({mensaje: 'No se ha podido guardar el disco'});
            }else{
                res.status(200).send({disco: discoGuardado});
            }
        }
    });
}

function actualizarDisco(req, res){
    var discoId = req.params.id;
    var actualizar = req.body;

    Disco.findByIdAndUpdate(discoId, actualizar, (err, discoActualizado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!discoActualizado){
                res.status(404).send({mensaje: 'No se ha podido actulizar el disco'});
            }else{
                res.status(200).send({disco: discoActualizado});
            }
        }
    });
}

function eliminarDisco(req, res){
    var discoId = req.params.id;

    Disco.findByIdAndRemove(discoId, (err, discoEliminado) => {
        if(err){
            res.status(500).send({mensaje: 'Error al eliminar el disco del album del artista'});
        }else{
            if(!discoEliminado){
                res.status(404).send({mensaje: 'El disco del album del artista no ha sido eliminado correctamente'});
            }else{
                Cancion.find({disco: discoEliminado._id}).remove((err, cancionEliminada) => {
                    if(err){
                        res.status(500).send({mensaje: 'Error al eliminar las canciones del disco'});
                    }else{
                        if(!cancionEliminada){
                            res.status(404).send({mensaje: 'Las canciones del disco no han sido eliminadas correctamente'});
                        }else{
                            res.status(200).send({disco: discoEliminado});
                        }
                    }
                });
            }
        }
    });
}


module.exports = {
    guardarDisco,
    obtenerDisco,
    obtenerDiscos,
    actualizarDisco,
    eliminarDisco
}