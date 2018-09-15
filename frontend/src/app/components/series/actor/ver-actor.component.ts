import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Serie } from "../../../models/series/serie/series";
import { SerieService } from "../../../services/series/serie/serie.service";
import { ActorService } from "../../../services/series/serie/actor.service";
import { Actor } from "../../../models/series/serie/actores";


@Component({
    selector: 'ver-actor',
    templateUrl: '../../../views/series/actor/ver-actor.html',
    providers: [UsuariosService, ActorService, SerieService]
})

export class VerActorComponent implements OnInit{
    public actor: Actor;
    public series: Serie[];
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _actorService: ActorService,
        private _serieService: SerieService
    ){
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para ver el detalle del actor. Cargado');

        // Llamar al metodo para sacar un actor segun su id
        this.obtenerActor();
    }

    obtenerActor(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._actorService.obtenerActor(this.token, id).subscribe(
                response => {
                    if(!response.actor){
                        this._router.navigate(['/series', 1]);
                    }else{
                        this.actor = response.actor;
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
                this._router.navigate(['series/', 1]);
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
}