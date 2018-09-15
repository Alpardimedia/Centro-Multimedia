import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { SubidasService } from "../../../services/subidas.service";
import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Actor } from "../../../models/series/serie/actores";
import { ActorService } from "../../../services/series/serie/actor.service";


@Component({
    selector: 'editar-actor',
    templateUrl: '../../../views/series/actor/nuevo-actor.html',
    providers: [UsuariosService, ActorService, SubidasService]
})

export class EditarActorComponent implements OnInit{
    public tituloPagina: string;
    public actor: Actor;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;
    public para_editar;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _subidasService: SubidasService,
        private _actorService: ActorService,
    ){
        this.tituloPagina = 'Guardar';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.actor = new Actor('','','','','');
        this.para_editar = true;
    }

    ngOnInit(){
        console.log('Componente para editar el actor de la serie. Cargado');

        // Llamar al metodo para sacar una serie segun su id
        this.obtenerActores();
        
    }

    obtenerActores(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._actorService.obtenerActor(this.token, id).subscribe(
                response => {
                    if(!response.actor){
                        this._router.navigate(['/actores', 1]);
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

    onSubmit(){
        console.log(this.actor);
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._actorService.editarActor(this.token, id, this.actor).subscribe(                
                response => {                    
                    if(!response.actor){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'El actor se ha actualizado correctamente';

                        if(!this.archivosParaSubir){
                            this._router.navigate(['/actor', response.actor._id]);
                        }else{
                            // Subir la imagen de la serie
                            this._subidasService.makeFileRequest(this.url + 'subir-imagen-actor/' + id, [], this.archivosParaSubir, this.token, 'imagen').then(
                                (result) => {
                                    this._router.navigate(['/actor', response.actor._id]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }

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

    public archivosParaSubir: Array<File>;

    fileChangeEvent(fileInput: any){
        this.archivosParaSubir = <Array<File>>fileInput.target.files;
    }
}