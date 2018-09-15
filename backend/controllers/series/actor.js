'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Serie = require('../../models/series/serie');
var Actor = require('../../models/series/actor');
var Temporada = require('../../models/series/temporada');
var Capitulo = require('../../models/series/capitulo');

function obtenerActor(req, res){
    var actorId = req.params.id;

    Actor.findById(actorId).populate({path: 'serie'}).exec((err, actor) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!actor){
                res.status(404).send({mensaje: 'No hay actor'});
            }else{
                res.status(200).send({actor});
            }
        }
    });
}

function obtenerActores(req, res){
    var serieId = req.params.serie;

    if(!serieId){
        // Sacar todos los actores de la base de datos
        var find = Actor.find({}).sort('nombre');
    }else{
        // Sacar los actores de una serie en concreto de la base de datos
        var find = Actor.find({serie: serieId}).sort('nombre');
    }

    find.populate({path: 'serie'}).exec((err, actores) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!actores){
                res.status(404).send({mensaje: 'No hay actores'});
            }else{
                res.status(200).send({actores});
            }
        }
    });
}

function getActores(req, res){
    var serieId = req.params.serie;

    if(!serieId){
        // Sacar todas las series de la BBDD
        var find = Actor.find({}).sort('nombre');
    }else{
        // Sacar las series del actor en concreto de la base de datos
        var find = Actor.find({serie: serieId}).sort('nombre');
    }

    find.populate({path: 'serie'}).exec((err, actores) => {
        if(err){
            res.status(500).send({mensaje: "Error en el servidor"});
        }else{
            if(!actores){
                res.status(404).send({mensaje: "No hay series"});
            }else{
                res.status(200).send({actores});
            }
        }
    });
}

function getActoresSerie(req, res){
    // Sacar todos los actores de la BBDD
    var find = Actor.find({}).sort('nombre');

    find.populate({path: 'serie'}).exec((err, actores) => {
        if(err){
            res.status(500).send({mensaje: "Error en el servidor"});
        }else{
            if(!actores){
                res.status(404).send({mensaje: "No hay series"});
            }else{
                res.status(200).send({actores});
            }
        }
    });
}

function guardarActor(req, res){
    var actor = new Actor();

    var parametros = req.body;

    actor.nombre = parametros.nombre;
    actor.nacimiento = parametros.nacimiento;
    actor.biografia = parametros.biografia;
    actor.imagen = 'null';
    actor.serie = parametros.serie;

    actor.save((err, actorAlmacenado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!actorAlmacenado){
                res.status(404).send({mensaje: 'No se ha guardado el actor'});
            }else{
                res.status(200).send({actor: actorAlmacenado});
            }
        }
    });
}

function actualizarActor(req, res){
    var actorId = req.params.id;
    var actualizar = req.body;

    Actor.findByIdAndUpdate(actorId, actualizar, (err, actorActualizado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!actorActualizado){
                res.status(404).send({mensaje: 'No se ha actualizado el actor'});
            }else{
                res.status(200).send({actor: actorActualizado});
            }
        }
    });
}

function eliminarActor(req, res){
    var actorId = req.params.id;

    Actor.findByIdAndRemove(actorId, (err, actorEliminado) => {
        if(err){
            res.status(500).send({mensaje: 'Error al eliminar el actor de la serie'});
        }else{
            if(!actorEliminado){
                res.status(404).send({mensaje: 'El/la actor/azctriz de la serie no ha sido eliminado/a correctamente'});
            }else{
                res.status(200).send({actor: actorEliminado});
            }
        }
    });
}

function subirImagen(req, res){
    var actorId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.imagen.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[3];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];        

        if(extension_archivo == 'png' || extension_archivo == 'jpg' || extension_archivo == 'gif'){
            Actor.findByIdAndUpdate(actorId, {imagen: nombre_archivo}, (err, actorActualizado) => {
                if(!actorActualizado){
                    res.status(404).send({mensaje: 'La imagen del actor no se ha podido actualizar'});
                }else{
                    res.status(200).send({actor: actorActualizado});
                }
            });
        }else{
            res.status(200).send({mensaje: 'La extension del archivo no es correcta'});
        }

    }else{
        res.status(200).send({mensaje: 'No has subido la imagen'});
    }
}

function obtenerArchivoImagen(req, res){
    var archivoImagen = req.params.archivoImagen;
    var ruta_archivo = './subidas/series/actores/' + archivoImagen;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    obtenerActor,
    guardarActor,
    obtenerActores,
    getActoresSerie,
    getActores,
    actualizarActor,
    eliminarActor,
    subirImagen,
    obtenerArchivoImagen
}