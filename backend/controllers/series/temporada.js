'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Serie = require('../../models/series/serie');
var Actor = require('../../models/series/actor');
var Temporada = require('../../models/series/temporada');
var Capitulo = require('../../models/series/capitulo');

function obtenerTemporada(req, res){
    var temporadaId = req.params.id;

    Temporada.findById(temporadaId).populate({path: 'serie'}).exec((err, temporada) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!temporada){
                res.status(404).send({mensaje: 'No hay temporada'});
            }else{
                res.status(200).send({temporada});
            }
        }
    });
}

function obtenerTemporadas(req, res){
    var serieId = req.params.serie;

    if(!serieId){
        // Sacar todas las temporadas de la BBDD
        var find = Temporada.find({}).sort('numero');
    }else{
        // Sacar las temporadas de la serie concreta de la BBDD
        var find = Temporada.find({serie: serieId}).sort({'numero': 1});
    }

    find.populate({path: 'serie'}).exec((err, temporadas) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!temporadas){
                res.status(404).send({mensaje: 'No hay temporadas'});
            }else{
                res.status(200).send({temporadas});
            }
        }
    });
}

function guardarTemporada(req, res){
    var temporada = new Temporada();

    var parametros = req.body;

    temporada.numero = parametros.numero;
    temporada.lanzamiento = parametros.lanzamiento;
    temporada.imagen = parametros.imagen;
    temporada.serie = parametros.serie;

    temporada.save((err, temporadaAlmacenado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!temporadaAlmacenado){
                res.status(404).send({mensaje: 'No se ha guardado la temporada'});
            }else{
                res.status(200).send({temporada: temporadaAlmacenado});
            }
        }
    });
}

function actualizarTemporada(req, res){
    var temporadaId = req.params.id;
    var actualizar = req.body;

    Temporada.findByIdAndUpdate(temporadaId, actualizar, (err, temporadaActualizado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!temporadaActualizado){
                res.status(404).send({mensaje: 'No se ha actualizado la temporada'});
            }else{
                res.status(200).send({temporada: temporadaActualizado});
            }
        }
    });
}

function eliminarTemporada(req, res){
    var temporadaId = req.params.id;

    Temporada.findByIdAndRemove(temporadaId, (err, temporadaEliminada) => {
        if(err){
            res.status(500).send({mensaje: 'Error al eliminar la temporada de la serie'});
        }else{
            if(!temporadaEliminada){
                res.status(404).send({mensaje: 'La temporada de la serie no ha sido eliminada correctamente'});
            }else{
                Capitulo.find({temporada: temporadaEliminada._id}).remove((err, capituloEliminado) => {
                    if(err){
                        res.status(500).send({mensaje: 'Error al eliminar los capitulos de las temporadas de la serie'});
                    }else{
                        if(!capituloEliminado){
                            res.status(404).send({mensaje: 'Los capitulos de las temporadas de la serie no han sido eliminados correctamente'});
                        }else{
                            res.status(200).send({temporada_eliminada: temporadaEliminada});
                        }
                    }
                });
            }
        }
    });
}

function subirImagen(req, res){
    var temporadaId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.imagen.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[3];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];        

        if(extension_archivo == 'png' || extension_archivo == 'jpg' || extension_archivo == 'gif'){
            Temporada.findByIdAndUpdate(temporadaId, {imagen: nombre_archivo}, (err, temporadaActualizada) => {
                if(!temporadaActualizada){
                    res.status(404).send({mensaje: 'La portada de la temporada no se ha podido subir'});
                }else{
                    res.status(200).send({temporada: temporadaActualizada});
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
    var ruta_archivo = './subidas/series/temporadas/' + archivoImagen;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    obtenerTemporada,
    guardarTemporada,
    obtenerTemporadas,
    actualizarTemporada,
    eliminarTemporada,
    subirImagen,
    obtenerArchivoImagen
}