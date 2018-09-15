'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Serie = require('../../models/series/serie');
var Actor = require('../../models/series/actor');
var Temporada = require('../../models/series/temporada');
var Capitulo = require('../../models/series/capitulo');

function obtenerCapitulo(req, res){
    var capituloId = req.params.id;

    Capitulo.findById(capituloId).populate({path: 'temporada', populate: {path: 'serie', model: 'Serie'}}).exec((err, capitulo) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!capitulo){
                res.status(404).send({mensaje: 'El capitulo no existe'});
            }else{
                res.status(200).send({capitulo});
            }
        }
    });
}

function obtenerCapitulos(req, res){
    var temporadaId = req.params.temporada;

    if(!temporadaId){
        var buscar = Capitulo.find({}).sort('numero');
    }else{
        var buscar = Capitulo.find({temporada: temporadaId}).sort('numero');
    }

    buscar.populate({
        path: 'temporada',
        populate: {
            path: 'serie',
            model: 'Serie'
        }
    }).exec((err, capitulos) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la peticion'});
        }else{
            if(!capitulos){
                res.status(404).send({mensaje: 'No hay capitulos'});
            }else{
                res.status(200).send({capitulos});
            }
        }
    });
}

function guardarCapitulo(req, res){
    var capitulo = new Capitulo();

    var parametros = req.body;

    capitulo.numero = parametros.numero;
    capitulo.titulo = parametros.titulo;
    capitulo.duracion = parametros.duracion;
    capitulo.sinopsis = parametros.sinopsis;
    capitulo.archivo = 'null';
    capitulo.temporada = parametros.temporada;

    capitulo.save((err, capituloAlmacenado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!capituloAlmacenado){
                res.status(404).send({mensaje: 'No se ha guardado el capitulo'});
            }else{
                res.status(200).send({capitulo: capituloAlmacenado});
            }
        }
    });
}

function actualizarCapitulo(req, res){
    var capituloId = req.params.id;
    var actualizar = req.body;

    Capitulo.findByIdAndUpdate(capituloId, actualizar, (err, capituloActualizado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!capituloActualizado){
                res.status(404).send({mensaje: 'No se ha actualizado el capitulo'});
            }else{
                res.status(200).send({capitulo: capituloActualizado});
            }
        }
    });
}

function eliminarCapitulo(req, res){
    var capituloId = req.params.id;

    Capitulo.findByIdAndRemove(capituloId, (err, capituloEliminado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!capituloEliminado){
                res.status(404).send({mensaje: 'No se ha eliminado el capitulo'});
            }else{
                res.status(200).send({capitulo: capituloEliminado});
            }
        }
    });
}

function subirArchivoVideo(req, res){
    var capituloId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.archivo.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[3];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];        

        if(extension_archivo == 'mp4' || extension_archivo == 'avi' || extension_archivo == 'mpg' || extension_archivo == 'mpeg' || extension_archivo == 'mkv'){
            Capitulo.findByIdAndUpdate(capituloId, {archivo: nombre_archivo}, (err, capituloActualizado) => {
                if(!capituloActualizado){
                    res.status(404).send({mensaje: 'El archivo de video del capitulo no se ha podido subido correctamente'});
                }else{
                    res.status(200).send({capitulo: capituloActualizado});
                }
            });
        }else{
            res.status(200).send({mensaje: 'La extension del video es:' + extension_archivo + ' no es correcta'});
        }

    }else{
        res.status(200).send({mensaje: 'No has subido el video'});
    }
}

function obtenerArchivoVideo(req, res){
    var archivoVideo = req.params.archivoVideo;
    var ruta_archivo = './subidas/series/capitulos/' + archivoVideo;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe el archivo de video...'});
        }
    });
}

module.exports = {
    obtenerCapitulo,
    guardarCapitulo,
    obtenerCapitulos,
    actualizarCapitulo,
    eliminarCapitulo,
    subirArchivoVideo,
    obtenerArchivoVideo
}