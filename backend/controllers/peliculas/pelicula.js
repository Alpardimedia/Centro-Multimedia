'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Pelicula = require('../../models/peliculas/pelicula');

function obtenerPelicula(req, res){
    var peliculaId = req.params.id;

    Pelicula.findById(peliculaId).exec((err, pelicula) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición.'});
        }else{
            if(!pelicula){
                res.status(404).send({mensaje: 'La pelicula no existe.'});
            }else{
                res.status(200).send({pelicula});
            }
        }
    });
}

function obtenerPeliculas(req, res){
    var buscar = Pelicula.find({}).sort('titulo');

    buscar.exec((err, peliculas) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!peliculas){
                res.status(404).send({mensaje: 'No hay peliculas'});
            }else{
                res.status(200).send({peliculas});
            }
        }
    });
}

function guardarPelicula(req, res){
    var pelicula = new Pelicula();

    var parametros = req.body;

    pelicula.titulo = parametros.titulo;
    pelicula.ano = parametros.ano;
    pelicula.duracion = parametros.duracion;
    pelicula.pais = parametros.pais;
    pelicula.director = parametros.director;
    pelicula.guionista = parametros.guionista;
    pelicula.compositor = parametros.compositor;
    pelicula.fotografo = parametros.fotografo;
    pelicula.reparto = parametros.reparto;
    pelicula.productor = parametros.productor;
    pelicula.genero = parametros.genero;
    pelicula.sinopsis = parametros.sinopsis;
    pelicula.caratura = pelicula.caratura;
    pelicula.archivo = 'null';

    pelicula.save((err, peliculaAlmacenada) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!peliculaAlmacenada){
                res.status(404).send({mensaje: 'No se ha guardado la pelicula'});
            }else{
                res.status(200).send({pelicula: peliculaAlmacenada});
            }
        }
    });
}

function actualizarPelicula(req, res){
    var peliculaId = req.params.id;
    var actualizar = req.body;

    Pelicula.findByIdAndUpdate(peliculaId, actualizar, (err, peliculaActualizada) => {
        if(err){
            res.status(500).send({mensaje: 'Error al actualizar la pelicula'});
        }else{
            if(!peliculaActualizada){
                res.status(404).send({mensaje: 'La pelicula no ha sido actualizada correctamente'});
            }else{
                res.status(200).send({pelicula: peliculaActualizada});
            }
        }
    });
}

function eliminarPelicula(req, res){
    var peliculaId = req.params.id;

    Pelicula.findByIdAndRemove(peliculaId, (err, peliculaEliminada) => {
        if(err){
            res.status(500).send({mensaje: 'Error al eliminar la pelicula'});
        }else{
            if(!peliculaEliminada){
                res.status(404).send({mensaje: 'La pelicula no ha sido eliminada correctamente'});
            }else{
                res.status(200).send({pelicula: peliculaEliminada});
            }
        }
    });
}

function subirCaratura(req, res){
    var peliculaId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.caratura.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[3];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];        

        if(extension_archivo == 'png' || extension_archivo == 'jpg' || extension_archivo == 'gif'){
            Pelicula.findByIdAndUpdate(peliculaId, {caratura: nombre_archivo}, (err, peliculaActualizada) => {
                if(!peliculaActualizada){
                    res.status(404).send({mensaje: 'La caratura de la pelicula no se ha podido subir'});
                }else{
                    res.status(200).send({pelicula: peliculaActualizada});
                }
            });
        }else{
            res.status(200).send({mensaje: 'La extension del archivo no es correcta'});
        }

    }else{
        res.status(200).send({mensaje: 'No has subido la caratura'});
    }
}

function obtenerCaraturaPelicula(req, res){
    var caratura_pelicula = req.params.caratura_pelicula;
    var ruta_archivo = './subidas/peliculas/caraturas/' + caratura_pelicula;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe la caratura...'});
        }
    });
}

function subirPelicula(req, res){
    var peliculaId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.archivo.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[3];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];        

        if(extension_archivo == 'mpg' || extension_archivo == 'mkv' || extension_archivo == 'mp4' || extension_archivo == 'avi' || extension_archivo == 'mpeg'){
            Pelicula.findByIdAndUpdate(peliculaId, {archivo: nombre_archivo}, (err, peliculaActualizada) => {
                if(!peliculaActualizada){
                    res.status(404).send({mensaje: 'La pelicula no se ha podido subir'});
                }else{
                    res.status(200).send({pelicula: peliculaActualizada});
                }
            });
        }else{
            res.status(200).send({mensaje: 'La extension del archivo no es correcta'});
        }

    }else{
        res.status(200).send({mensaje: 'No has subido la pelicula'});
    }
}

function obtenerArchivoPelicula(req, res){
    var archivo_pelicula = req.params.archivo_pelicula;
    var ruta_archivo = './subidas/peliculas/peliculas/' + archivo_pelicula;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe la pelicula...'});
        }
    });
}

module.exports = {
    guardarPelicula,
    obtenerPelicula,
    obtenerPeliculas,
    actualizarPelicula,
    eliminarPelicula,
    subirCaratura,
    obtenerCaraturaPelicula,
    subirPelicula,
    obtenerArchivoPelicula
}