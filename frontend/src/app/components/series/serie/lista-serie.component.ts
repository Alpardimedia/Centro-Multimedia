import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Serie } from "../../../models/series/serie/series";
import { SerieService } from "../../../services/series/serie/serie.service";
import { Actor } from "../../../models/series/serie/actores";
import { ActorService } from "../../../services/series/serie/actor.service";


@Component({
    selector: 'lista-serie',
    templateUrl: '../../../views/series/serie/lista-serie.html',
    providers: [UsuariosService, SerieService, ActorService]
})

export class ListaSerieComponent implements OnInit{
    public titulo: string;
    public series: Serie[];
    public actores: Actor[];
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
        private _actorService: ActorService,
        private _serieService: SerieService
    ){
        this.titulo = 'Series';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.siguiente_pagina = 1;
        this.anterior_pagina = 1;
    }

    ngOnInit(){
        console.log('Componente para listar las series. Cargado');
        
        // Conseguiremos el listado de las series
        this.obtenerSeries();
    }

    obtenerSeries(){
        this._route.params.forEach((params: Params) =>{

            this._serieService.obtenerSeries(this.token).subscribe(
                response => {
                    if(!response.series){
                        this._router.navigate(['/']);
                    }else{
                        this.series = response.series;                       
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

    onCancelarSerie(id){
        this.confirmado = null;
    }

    onEliminarSerie(id){
        this._serieService.eliminarSerie(this.token, id).subscribe(
            response => {
                if(response.series){
                    alert("Error en el servidor")
                }
                this._router.navigate(['/series']);
                this.obtenerSeries();
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

