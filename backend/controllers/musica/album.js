'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artista = require('../../models/musica/artista');
var Album = require('../../models/musica/album');
var Disco = require('../../models/musica/disco');
var Cancion = require('../../models/musica/cancion');

function obtenerAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artista'}).exec((err, album) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!album){
                res.status(404).send({mensaje: 'No hay album'});
            }else{
                res.status(200).send({album});
            }
        }
    });
}

function obtenerAlbums(req, res){
    var artistaId = req.params.artista;

    if(!artistaId){
        // Sacar todos los albums de la Base de Datos
        var buscar = Album.find({}).sort('titulo');
    }else{
        // Sacar los albums del artista concreto de la Base de Datos
        var buscar = Album.find({artista: artistaId}).sort({'titulo': 1});
    }

    buscar.populate({path: 'artista'}).exec((err, albums) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!albums){
                res.status(404).send({mensaje: 'No hay albums'});
            }else{
                res.status(200).send({albums});
            }
        }
    });
}

function guardarAlbum(req, res){
    var album = new Album();

    var parametros = req.body;

    album.titulo = parametros.titulo;
    album.publicacion = parametros.publicacion;
    album.discografia = parametros.discografia;
    album.genero = parametros.genero;
    album.imagen = parametros.imagen;
    album.artista = parametros.artista;

    album.save((err, albumGuardado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la peticion'});
        }else{
            if(!albumGuardado){
                res.status(404).send({mensaje: 'No se ha guardado el album'});
            }else{
                res.status(200).send({album: albumGuardado});
            }
        }
    });
}

function actualizarAlbum(req, res){
    var albumId = req.params.id;
    var actualizar = req.body;

    Album.findByIdAndUpdate(albumId, actualizar, (err, albumActualizado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en el servidor'});
        }else{
            if(!albumActualizado){
                res.status(404).send({mensaje: 'No se ha actualizado el album'});
            }else{
                res.status(200).send({album: albumActualizado});
            }
        }
    });
}

function eliminarAlbum(req, res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumEliminado) => {
        if(err){
            res.status(500).send({mensaje: 'Error al eliminar el album del artista'});
        }else{
            if(!albumEliminado){
                res.status(404).send({mensaje: 'El album del artista no ha sido eliminado correctamente'});
            }else{
                Disco.find({album: albumEliminado._id}).remove((err, discoEliminado) => {
                    if(err){
                        res.status(500).send({mensaje: 'Error al eliminar los discos del album'});
                    }else{
                        if(!discoEliminado){
                            res.status(404).send({mensaje: 'Los discos de los albums del artista no ha sido eliminados correctamente'});
                        }else{
                            Cancion.find({disco: discoEliminado._id}).remove((err, cancionEliminada) => {
                                if(err){
                                    res.status(500).send({mensaje: 'Error al eliminar las canciones del disco'});
                                }else{
                                    if(!cancionEliminada){
                                        res.status(404).send({mensaje: 'Las canciones del disco no han sido eliminadas correctamente'});
                                    }else{
                                        res.status(200).send({album: albumEliminado});
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
    var albumId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.imagen.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[3];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];        

        if(extension_archivo == 'png' || extension_archivo == 'jpg' || extension_archivo == 'gif'){
            Album.findByIdAndUpdate(albumId, {imagen: nombre_archivo}, (err, albumActualizado) => {
                if(!albumActualizado){
                    res.status(404).send({mensaje: 'La portada del album no se ha podido subir'});
                }else{
                    res.status(200).send({album: albumActualizado});
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
    var ruta_archivo = './subidas/musica/albums/' + archivoImagen;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    guardarAlbum,
    obtenerAlbum,
    obtenerAlbums,
    actualizarAlbum,
    eliminarAlbum,
    subirImagen,
    obtenerArchivoImagen
}