'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var clave_secreta = 'Clave_Secreta_Centro_Multimedia';

exports.ensureAut = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({mensaje: 'La petición no tiene la cabecera de autenticación'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = jwt.decode(token, clave_secreta);

        if(payload.fin <= moment().unix()){
            return res.status(401).send({mensaje: 'El token a expirado'});
        }
    }catch(ex){
        // console.log(ex);
        return res.status(404).send({mensaje: 'El token no es válido'});
    }

    req.usuario = payload;

    next();
};