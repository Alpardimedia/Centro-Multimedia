import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { AlbumService } from "../../../services/musica/album.service";
import { Album } from "../../../models/musica/albums";
import { DiscoService } from "../../../services/musica/disco.service";
import { Disco } from "../../../models/musica/discos";


@Component({
    selector: 'ver-album',
    templateUrl: '../../../views/musica/albums/ver-album.html',
    providers: [UsuariosService, AlbumService, DiscoService]
})

export class VerAlbumComponent implements OnInit{
    public discos: Disco[];
    public album: Album;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _discoService: DiscoService,
        private _albumService: AlbumService
    ){
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para ver el detalle de los albums. Cargado');

        // Llamar al metodo para sacar un album segun su id
        this.obtenerAlbum();
    }

    obtenerAlbum(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._albumService.obtenerAlbum(this.token, id).subscribe(
                response => {
                    if(!response.album){
                        this._router.navigate(['/albums']);
                    }else{
                        this.album = response.album;

                        // Sacar los discos del album
                        this._discoService.obtenerDiscos(this.token, response.album._id).subscribe(
                            response => {
                                if(!response.discos){
                                    this.alertaMensaje = "Este album no tiene disco";
                                }else{
                                    this.discos = response.discos;
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

    onCancelarDisco(id){
        this.confirmado = null;
    }

    onEliminarDisco(id){
        this._discoService.eliminarDisco(this.token, id).subscribe(
            response => {
                if(!response.discos){
                    this.alertaMensaje = "Error en el servidor";
                }
                
                this.obtenerAlbum();
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

    onEliminarConfirmar(id){
        this.confirmado = id;
    }
}