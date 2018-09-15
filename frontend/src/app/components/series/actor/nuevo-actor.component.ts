import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Actor } from "../../../models/series/serie/actores";
import { ActorService } from "../../../services/series/serie/actor.service";


@Component({
    selector: 'nuevo-actor',
    templateUrl: '../../../views/series/actor/nuevo-actor.html',
    providers: [UsuariosService, ActorService]
})

export class NuevoActorComponent implements OnInit{
    public tituloPagina: string;
    public actor: Actor;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _actorService: ActorService
    ){
        this.tituloPagina = 'Siguiente';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.actor = new Actor('','','','','');
    }

    ngOnInit(){
        console.log('Componente para crear un nuevo actor. Cargado');
    }
    
    onSubmit(){
        this._route.params.forEach((params: Params) => {
            let serieId = params['serie'];
            this.actor.serie = serieId;

            this._actorService.nuevoActor(this.token, this.actor).subscribe(
                response => {
                    if(!response.actor){
                        this.alertaMensaje = "Error en el servidor";
                    }else{
                        this.alertaMensaje = "¡El actor se ha creado correctamente!";
                        this.actor = response.actor;

                        console.log(this.actor);
                        

                        this._router.navigate(['/editar-actor', response.actor._id]);
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
}