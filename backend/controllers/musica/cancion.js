'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artista = require('../../models/musica/artista');
var Album = require('../../models/musica/album');
var Disco = require('../../models/musica/disco');
var Cancion = require('../../models/musica/cancion');

function obtenerCancion(req, res){
    var cancionId = req.params.id;
    
    Cancion.findById(cancionId).populate(
        {
            path: 'disco',
            populate: {
                path: 'album',
                model: 'Album', 
                populate: {
                    path: 'artista', 
                    model: 'Artista'
                }
            }
        }).exec((err, cancion) => {
            if(err){
                res.status(500).send({mensaje: 'Error en la petición'});
            }else{
                if(!cancion){
                    res.status(404).send({mensaje: 'La canción no existe'});
                }else{
                    res.status(200).send({cancion});
                }
            }
    });
}

function obtenerCanciones(req, res){
    var discoId = req.params.disco;

    if(!discoId){
        var buscar = Cancion.find({}).sort('numero');
    }else{
        var buscar = Cancion.find({disco: discoId}).sort('numero');
    }

    buscar.populate({
        path: 'disco',
        populate: {
            path: 'album',
            model: 'Album',
            populate: {
                path: 'artista',
                model: 'Artista'
            }
        }
    }).exec((err, canciones) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!canciones){
                res.status(404).send({mensaje: 'No hay canciones'});
            }else{
                res.status(200).send({canciones});
            }
        }
    });
}

function guardarCancion(req, res){
    var cancion = new Cancion();

    var parametros = req.body;

    cancion.numero = parametros.numero;
    cancion.nombre = parametros.nombre;
    cancion.duracion = parametros.duracion;
    cancion.letra = parametros.letra;
    cancion.archivo = parametros.archivo;
    cancion.disco = parametros.disco;

    cancion.save((err, cancionGuardada) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!cancionGuardada){
                res.status(404).send({mensaje: 'No se ha podido guardar la canción'})
            }else{
                res.status(200).send({cancion: cancionGuardada});
            }
        }
    });
}

function actualizarCancion(req, res){
    var cancionId = req.params.id;
    var actualizar = req.body;

    Cancion.findByIdAndUpdate(cancionId, actualizar, (err, cancionActualizada) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!cancionActualizada){
                res.status(404).send({mensaje: 'No se ha actualizado la canción'});
            }else{
                res.status(200).send({cancion: cancionActualizada});
            }
        }
    });
}

function eliminarCancion(req, res){
    var cancionId = req.params.id;

    Cancion.findByIdAndRemove(cancionId, (err, cancionEliminada) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!cancionEliminada){
                res.status(404).send({mensaje: 'No se ha eliminado la canción'});
            }else{
                res.status(200).send({cancion: cancionEliminada});
            }
        }
    });
}

function subirArchivoCancion(req, res){
    var cancionId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.archivo.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[3];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];        

        if(extension_archivo == 'mp3' || extension_archivo == 'ogg'){
            Cancion.findByIdAndUpdate(cancionId, {archivo: nombre_archivo}, (err, cancionActualizado) => {
                if(!cancionActualizado){
                    res.status(404).send({mensaje: 'La canción no se ha podido subido correctamente'});
                }else{
                    res.status(200).send({cancion: cancionActualizado});
                }
            });
        }else{
            res.status(200).send({mensaje: 'La extension de la canción es:' + extension_archivo + ' y no es correcta'});
        }

    }else{
        res.status(200).send({mensaje: 'No has subido la canción'});
    }
}

function obtenerArchivoCancion(req, res){
    var archivoCancion = req.params.archivoAudio;
    var ruta_archivo = './subidas/musica/canciones/' + archivoCancion;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe el archivo de audio...'});
        }
    });
}

module.exports = {
    guardarCancion,
    obtenerCancion,
    obtenerCanciones,
    actualizarCancion,
    eliminarCancion,
    subirArchivoCancion,
    obtenerArchivoCancion
}