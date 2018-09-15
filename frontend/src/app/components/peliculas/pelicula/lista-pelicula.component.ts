import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { PeliculasService } from "../../../services/peliculas/peliculas.service";
import { Pelicula } from "../../../models/peliculas/pelicula";


@Component({
    selector: 'lista-pelicula',
    templateUrl: '../../../views/peliculas/pelicula/lista-pelicula.html',
    providers: [UsuariosService, PeliculasService]
})

export class ListaPeliculasComponent implements OnInit{
    public titulo: string;
    public peliculas: Pelicula[];
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;
    public siguiente_pagina;
    public anterior_pagina;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _peliculaService: PeliculasService
    ){
        this.titulo = 'Peliculas';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para listar las peliculas. Cargado');
        
        // Conseguiremos el listado de las peliculas
        this.obtenerPeliculas();
    }

    obtenerPeliculas(){
        this._route.params.forEach((params: Params) =>{

            this._peliculaService.obtenerPeliculas(this.token).subscribe(
                response => {
                    if(!response.peliculas){
                        this._router.navigate(['/']);
                    }else{
                        this.peliculas = response.peliculas;                       
                    }                    
                },
                error => {
                    var mensajeError = <any>error;
    
                    if(mensajeError != null){
                        var cuerpo = JSON.parse(error._body);
                        this.alertaMensaje = cuerpo.mensaje;
    
                        console.log(error);
                    }
                }
            );
        });
    }

    public confirmado;

    onEliminarConfirmar(id){
        this.confirmado = id;
    }

    onCancelarPelicula(id){
        this.confirmado = null;
    }

    onEliminarPelicula(id){
        this._peliculaService.eliminarPelicula(this.token, id).subscribe(
            response => {
                if(response.peliculas){
                    alert("Error en el servidor")
                }
                this._router.navigate(['/peliculas']);
                this.obtenerPeliculas();
            },
            error => {
                var mensajeError = <any>error;

                if(mensajeError != null){
                    var cuerpo = JSON.parse(error._body);
                    // this.alertaMensaje = cuerpo.mensaje;

                    console.log(error);
                }
            }
        );
    }
}

