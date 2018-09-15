import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Serie } from "../../../models/series/serie/series";
import { SerieService } from "../../../services/series/serie/serie.service";
import { ActorService } from "../../../services/series/serie/actor.service";
import { Actor } from "../../../models/series/serie/actores";


@Component({
    selector: 'nueva-serie',
    templateUrl: '../../../views/series/serie/nueva-serie.html',
    providers: [UsuariosService, SerieService, ActorService]
})

export class NuevaSerieComponent implements OnInit{
    public tituloPagina: string;
    public serie: Serie;
    public actores: Actor[];
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
        this.tituloPagina = 'Siguiente';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.serie = new Serie('','','','','');
    }

    ngOnInit(){
        console.log('Componente para crear una nueva serie. Cargado');
    }

    onSubmit(){
        console.log(this.serie);
        this._route.params.forEach((params: Params) => {
            let actor_id = params['id'];
            this.serie.actor = actor_id;

            this._serieService.nuevaSerie(this.token, this.serie).subscribe(
                response => {
                    if(!response.serie){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'La serie se ha creado correctamente';
                        this.serie = response.serie;
                        
                        this._router.navigate(['/editar-serie/', response.serie._id]);
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