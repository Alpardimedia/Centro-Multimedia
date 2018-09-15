import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Serie } from "../../../models/series/serie/series";
import { SerieService } from "../../../services/series/serie/serie.service";
import { TemporadaService } from "../../../services/series/serie/temporada.service";
import { Temporada } from "../../../models/series/serie/temporadas";
import { Actor } from "../../../models/series/serie/actores";
import { ActorService } from "../../../services/series/serie/actor.service";


@Component({
    selector: 'ver-serie',
    templateUrl: '../../../views/series/serie/ver-serie.html',
    providers: [UsuariosService, SerieService, TemporadaService, ActorService]
})

export class VerSerieComponent implements OnInit{
    public serie: Serie;
    public temporadas: Temporada[];
    public actores: Actor[];
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _serieService: SerieService,
        private _actorService: ActorService,
        private _temporadaService: TemporadaService
    ){
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para ver el detalle de la serie. Cargado');

        // Llamar al metodo para sacar una serie segun su id
        this.obtenerSerie();
    }

    obtenerSerie(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._serieService.obtenerSerie(this.token, id).subscribe(
                response => {
                    if(!response.serie){
                        this._router.navigate(['/series', 1]);
                    }else{
                        this.serie = response.serie;

                        // Sacar las temporadas de la serie
                        this._temporadaService.obtenerTemporadas(this.token, response.serie._id).subscribe(
                            response => {
                                if(!response.temporadas){
                                    this.alertaMensaje = "Esta serie no tiene temporadas";
                                }else{
                                    this.temporadas = response.temporadas;
                                }                                
                            },
                            error => {
                                var mensajeError = <any>error;
                
                                if(mensajeError != null){
                                    var cuerpo = JSON.parse(error._body);
                
                                    console.log(error);
                                }
                            }
                        );

                        // Sacar los actores de la serie
                        this._actorService.obtenerActores(this.token, response.serie._id).subscribe(
                            response => {
                                if(!response.actores){
                                    this.alertaMensaje = "Esta serie no tiene actores";
                                }else{
                                    this.actores = response.actores;
                                }
                            },
                            error => {
                                var mensajeError = <any>error;
                
                                if(mensajeError != null){
                                    var cuerpo = JSON.parse(error._body);
                
                                    console.log(error);
                                }
                            }
                        );
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

    onCancelarActor(id){
        this.confirmado = null;
    }

    onEliminarActor(id){
        this._actorService.eliminarActor(this.token, id).subscribe(
            response => {
                if(response.actores){
                    alert("Error en el servidor")
                }
                this._router.navigate(['series']);
                this.obtenerSerie();
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

    onEliminarConfirmar(id){
        this.confirmado = id;
    }

    onCancelarTemporada(id){
        this.confirmado = null;
    }

    onEliminarTemporada(id){
        this._temporadaService.eliminarTemporada(this.token, id).subscribe(
            response => {
                if(!response.temporada){
                    this.alertaMensaje = 'Error en el servidor';
                }

                this.obtenerSerie();
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
    }
}