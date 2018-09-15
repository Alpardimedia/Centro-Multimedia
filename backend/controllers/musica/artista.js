'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artista = require('../../models/musica/artista');
var Album = require('../../models/musica/album');
var Disco = require('../../models/musica/disco');
var Cancion = require('../../models/musica/cancion');

function obtenerArtista(req, res){
    var artistaId = req.params.id;

    Artista.findById(artistaId, (err, artista) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición.'});
        }else{
            if(!artista){
                res.status(404).send({mensaje: 'El artista no existe.'});
            }else{
                res.status(200).send({artista});
            }
        }
    });
}

function obtenerArtistas(req, res){
    var buscar = Artista.find({}).sort('nombre');

    buscar.exec((err, artistas) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!artistas){
                res.status(404).send({mensaje: 'No hay artistas'});
            }else{
                res.status(200).send({artistas});
            }
        }
    });
}

function guardarArtista(req, res){
    var artista = new Artista();

    var parametros = req.body;

    artista.nombre = parametros.nombre;
    artista.biografia = parametros.biografia;
    artista.nacimiento = parametros.nacimiento;
    artista.imagen = parametros.imagen;

    artista.save((err, artistaAlmacenado) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!artistaAlmacenado){
                res.status(404).send({mensaje: 'No se ha guardado el artista'});
            }else{
                res.status(200).send({artista: artistaAlmacenado});
            }
        }
    });
}

function actualizarArtista(req, res){
    var artistaId = req.params.id;
    var actualizar = req.body;

    Artista.findByIdAndUpdate(artistaId, actualizar, (err, artistaActualizado) => {
        if(err){
            res.status(500).send({mensaje: 'Error al actualizar el artista'});
        }else{
            if(!artistaActualizado){
                res.status(404).send({mensaje: 'El artista no ha sido actualizado correctamente'});
            }else{
                res.status(200).send({artista: artistaActualizado});
            }
        }
    });
}

function eliminarArtista(req, res){
    var artistaId = req.params.id;

    Artista.findByIdAndRemove(artistaId, (err, artistaEliminado) => {
        if(err){
            res.status(500).send({mensaje: 'Error al eliminar el artista'});
        }else{
            if(!artistaEliminado){
                res.status(404).send({mensaje: 'El artista no ha sido eliminado correctamente'});
            }else{
                Album.find({artista: artistaEliminado._id}).remove((err, albumEliminado) => {
                    if(err){
                        res.status(500).send({mensaje: 'Error al eliminar los albums del artista'});
                    }else{
                        if(!albumEliminado){
                            res.status(404).send({mensaje: 'Los albums del artista no han sido eliminados correctamente'});
                        }else{
                            Disco.find({album: albumEliminado._id}).remove((err, discoEliminado) => {
                                if(err){
                                    res.status(500).send({mensaje: 'Error al eliminar los discos de los albums del artista'});
                                }else{
                                    if(!discoEliminado){
                                        res.status(404).send({mensaje: 'Los discos de los albums del artista no han sido eliminados correctamente'});
                                    }else{
                                        Cancion.find({disco: discoEliminado._id}).remove((err, cancionEliminada) => {
                                            if(err){
                                                res.status(500).send({mensaje: 'Error al eliminar las canciones de los discos de los albums del artista'});
                                            }else{
                                                if(!cancionEliminada){
                                                    res.status(404).send({mensaje: 'Las canciones de los discos de los albums del artista no han sido eliminadas correctamente'});
                                                }else{
                                                    res.status(200).send({artista: artistaEliminado});
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
        }
    });
}

function subirImagen(req, res){
    var artistaId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.imagen.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[3];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];        

        if(extension_archivo == 'png' || extension_archivo == 'jpg' || extension_archivo == 'gif'){
            Artista.findByIdAndUpdate(artistaId, {imagen: nombre_archivo}, (err, artistaActualizado) => {
                if(!artistaActualizado){
                    res.status(404).send({mensaje: 'La fotografía del artista no se ha podido subir'});
                }else{
                    res.status(200).send({artista: artistaActualizado});
                }
            });
        }else{
            res.status(200).send({mensaje: 'La extension del archivo no es correcta'});
        }

    }else{
        res.status(200).send({mensaje: 'No has subido la foto'});
    }
}

function obtenerArchivoImagen(req, res){
    var archivoImagen = req.params.archivoImagen;
    var ruta_archivo = './subidas/musica/artistas/' + archivoImagen;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe la fotografía...'});
        }
    });
}

module.exports = {
    guardarArtista,
    obtenerArtista,
    obtenerArtistas,
    actualizarArtista,
    eliminarArtista,
    subirImagen,
    obtenerArchivoImagen
}