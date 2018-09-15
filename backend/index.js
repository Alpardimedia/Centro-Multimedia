'use srict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 1990;

mongoose.connect('mongodb://localhost:27017/centro_multimedia', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("La conexión a la base de datos está funcionando correctamente...");

        app.listen(port, function(){
            console.log("El servidor del API Rest del Centro Multimedia escuchando en http://localhost:" + port);
            
        });
    }
});