'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Serie = require('../../models/series/serie');
var Actor = require('../../models/series/actor');
var Temporada = require('../../models/series/temporada');
var Capitulo = require('../../models/series/capitulo');

function obtenerSerie(req, res){
    var serieId = req.params.id;

    Serie.findById(serieId, (err, serie) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición.'});
        }else{
            if(!serie){
                res.status(404).send({mensaje: 'La serie no existe.'});
            }else{
                res.status(200).send({serie});
            }
        }
    });
}

function obtenerSeries(req, res){
    var buscar = Serie.find({}).sort('titulo');

    buscar.exec((err, series) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!series){
                res.status(404).send({mensaje: 'No hay series'});
            }else{
                res.status(200).send({series});
            }
        }
    });
}

function getSeries(req, res){
    var actorId = req.params.id;

    if(!actorId){
        // Sacar todas las series de la BBDD
        var find = Serie.find({}).sort('nombre');
    }else{
        // Sacar las series del actor en concreto de la base de datos
        var find = Serie.find({actor: actorId}).sort('titulo');
    }

    find.populate({path: 'serie'}).exec((err, series) => {
        if(err){
            res.status(500).send({mensaje: "Error en el servidor"});
        }else{
            if(!series){
                res.status(404).send({mensaje: "No hay series"});
            }else{
                res.status(200).send({series});
            }
        }
    });
}

function guardarSerie(req, res){
    var serie = new Serie();

    var parametros = req.body;
    serie.titulo = parametros.titulo;
    serie.ano = parametros.ano;
    serie.sinopsis = parametros.sinopsis;
    serie.imagen = 'null';
    serie.actor = parametros.actor;

    serie.save((err, serieAlmacenada) => {
        if(err){
            res.status(500).send({mensaje: 'Error al guardar la serie'});
        }else{
            if(!serieAlmacenada){
                res.status(404).send({mensaje: 'La serie no ha sido guardado correctamente'});
            }else{
                res.status(200).send({serie: serieAlmacenada});
            }
        }
    });
}

function actualizarSerie(req, res){
    var serieId = req.params.id;
    var actualizar = req.body;

    Serie.findByIdAndUpdate(serieId, actualizar, (err, serieActualizada) => {
        if(err){
            res.status(500).send({mensaje: 'Error al actualizar la serie'});
        }else{
            if(!serieActualizada){
                res.status(404).send({mensaje: 'La serie no ha sido actualizada correctamente'});
            }else{
                res.status(200).send({serie: serieActualizada});
            }
        }
    });
}

function eliminarSerieActor(req, res){
    var serieId = req.params.id;

    Serie.findByIdAndRemove(serieId, (err, serieEliminada) => {
        if(err){
            res.status(500).send({mensaje: 'Error al eliminar la serie'});
        }else{
            if(!serieEliminada){
                res.status(404).send({mensaje: 'La serie no ha sido eliminada correctamente'});
            }else{
                Actor.find({serie: serieEliminada._id}).remove((err, actorEliminado) => {
                    if(err){
                        res.status(500).send({mensaje: 'Error al eliminar los actores de la serie'});
                    }else{
                        if(!actorEliminado){
                            res.status(404).send({mensaje: 'Los actores de la serie no han sido eliminadas correctamente'});
                        }else{
                            res.status(200).send({serie_eliminada: serieEliminada});
                        }
                    }
                });
            }
        }
    });
}

function eliminarSerie(req, res){
    var serieId = req.params.id;

    Serie.findByIdAndRemove(serieId, (err, serieEliminada) => {
        if(err){
            res.status(500).send({mensaje: 'Error al eliminar la serie'});
        }else{
            if(!serieEliminada){
                res.status(404).send({mensaje: 'La serie no ha sido eliminada correctamente'});
            }else{
                Temporada.find({serie: serieEliminada._id}).remove((err, temporadaEliminada) => {
                    if(err){
                        res.status(500).send({mensaje: 'Error al eliminar las temporadas de la serie'});
                    }else{
                        if(!temporadaEliminada){
                            res.status(404).send({mensaje: 'Las temporadas de la serie no han sido eliminadas correctamente'});
                        }else{
                            Capitulo.find({temporada: temporadaEliminada._id}).remove((err, capituloEliminado) => {
                                if(err){
                                    res.status(500).send({mensaje: 'Error al eliminar los capitulos de las temporadas de la serie'});
                                }else{
                                    if(!capituloEliminado){
                                        res.status(404).send({mensaje: 'Los capitulos de las temporadas de la serie no han sido eliminados correctamente'});
                                    }else{
                                        res.status(200).send({serie_eliminada: serieEliminada});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function subirImagen(req, res){
    var serieId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.imagen.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[3];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];        

        if(extension_archivo == 'png' || extension_archivo == 'jpg' || extension_archivo == 'gif'){
            Serie.findByIdAndUpdate(serieId, {imagen: nombre_archivo}, (err, serieActualizada) => {
                if(!serieActualizada){
                    res.status(404).send({mensaje: 'La portada de la serie no se ha podido subir'});
                }else{
                    res.status(200).send({serie: serieActualizada});
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
    var ruta_archivo = './subidas/series/portadas/' + archivoImagen;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    obtenerSerie,
    guardarSerie,
    getSeries,
    obtenerSeries,
    actualizarSerie,
    eliminarSerieActor,
    eliminarSerie,
    subirImagen,
    obtenerArchivoImagen
};