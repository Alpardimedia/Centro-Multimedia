'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var clave_secreta = 'Clave_Secreta_Centro_Multimedia';

exports.crearToken = function(usuario){
    var payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        password: usuario.password,
        rol: usuario.rol,
        imagen: usuario.imagen,

        inicio: moment().unix(),
        fin: moment().add(30, 'dias').unix
    };

    return jwt.encode(payload, clave_secreta);
};