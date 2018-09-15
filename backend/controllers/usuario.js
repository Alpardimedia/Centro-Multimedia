'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');

function saveUsuario(req, res){
    var usuario = new Usuario();

    var parametros = req.body;

    console.log(parametros);    

    usuario.nombre = parametros.nombre;
    usuario.apellido = parametros.apellido;
    usuario.email = parametros.email;
    usuario.rol = 'Usuario';
    usuario.imagen = 'null';

    if(parametros.password){
        // Encriptar la contraseña
        bcrypt.hash(parametros.password, null, null, function(err, hash){
            usuario.password = hash;
            if(usuario.nombre != null && usuario.apellido != null && usuario.email != null){
                // Guardar el usuario
                usuario.save((err, usuarioAlmacenado) => {
                    if(err){
                        res.status(500).send({mensaje: 'Error al guardar el usuario'});
                    }else{
                        if(!usuarioAlmacenado){
                            res.status(404).send({mensaje: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({usuario: usuarioAlmacenado});
                        }
                    }
                });
            }else{
                res.status(200).send({mensaje: 'Rellena todos los campos'});
            }
        });
    }else{
        res.status(200).send({mensaje: 'Introduce la contraseña'});
    }
}

function loginUsuario(req, res){
    var parametros = req.body;

    var email = parametros.email;
    var password = parametros.password;

    Usuario.findOne({email: email.toLowerCase()}, (err, usuario) => {
        if(err){
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if(!usuario){
                res.status(404).send({mensaje: 'El usuario no existe'});
            }else{
                // Comprobar la contraseña
                bcrypt.compare(password, usuario.password, function(err, check){
                    if(check){
                        // Devolver los datos del usuario logueado
                        if(parametros.gethash){
                            // Devolver un token de jwt
                            res.status(200).send({token: jwt.crearToken(usuario)});
                        }else{
                            res.status(200).send({usuario});
                        }
                    }else{
                        res.status(404).send({mensaje: 'El usuario no ha podido iniciar sesion'});
                    }
                });
            }
        }
    });
}

function actualizarUsuario(req, res){
    var usuarioId = req.params.id;
    var actualizar = req.body;

    if(usuarioId != req.usuario.sub){
        return res.status(500).send({mensaje: 'No tienes permiso para actualizar este usuario'});
    }

    Usuario.findByIdAndUpdate(usuarioId, actualizar, (err, usuarioActualizado) => {
        if(err){
            res.status(500).send({mensaje: 'Error al actualizar el usuario'});
        }else{
            if(!usuarioActualizado){
                res.status(404).send({mensaje: 'El usuario no se ha podido actualizar'});
            }else{
                res.status(200).send({usuario: usuarioActualizado});
            }
        }
    });
}

function subirImagen(req, res){
    var usuarioId = req.params.id;
    var nombre_archivo = 'No subido...';

    if(req.files){
        var ruta_archivo = req.files.imagen.path;
        var recortar_archivo = ruta_archivo.split('\\');
        var nombre_archivo = recortar_archivo[2];

        var recortar_extension = nombre_archivo.split('\.');
        var extension_archivo = recortar_extension[1];

        if(extension_archivo == 'png' || extension_archivo == 'jpg' || extension_archivo == 'gif'){
            Usuario.findByIdAndUpdate(usuarioId, {imagen: nombre_archivo}, (err, usuarioActualizado) => {
                if(!usuarioActualizado){
                    res.status(404).send({mensaje: 'El usuario no se ha podido actualizar'});
                }else{
                    res.status(200).send({imagen: nombre_archivo, usuario: usuarioActualizado});
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
    var ruta_archivo = './subidas/usuarios/' + archivoImagen;

    fs.exists(ruta_archivo, function(exists){
        if(exists){
            res.sendFile(path.resolve(ruta_archivo));
        }else{
            res.status(200).send({mensaje: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    saveUsuario,
    loginUsuario,
    actualizarUsuario,
    subirImagen,
    obtenerArchivoImagen
};