import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { ArtistaService } from "../../../services/musica/artista.service";
import { Artista } from "../../../models/musica/artistas";
import { AlbumService } from "../../../services/musica/album.service";
import { Album } from "../../../models/musica/albums";


@Component({
    selector: 'ver-artista',
    templateUrl: '../../../views/musica/artistas/ver-artista.html',
    providers: [UsuariosService, ArtistaService, AlbumService]
})

export class VerArtistaComponent implements OnInit{
    public artista: Artista;
    public albums: Album[];
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _artistaService: ArtistaService,
        private _albumService: AlbumService
    ){
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para ver el detalle del artista. Cargado');

        // Llamar al metodo para sacar un artista segun su id
        this.obtenerArtista();
    }

    obtenerArtista(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._artistaService.obtenerArtista(this.token, id).subscribe(
                response => {
                    if(!response.artista){
                        this._router.navigate(['/artistas']);
                    }else{
                        this.artista = response.artista;

                        // Sacar los albums del artista
                        this._albumService.obtenerAlbums(this.token, response.artista._id).subscribe(
                            response => {
                                if(!response.albums){
                                    this.alertaMensaje = "Este artista no tiene albums";
                                }else{
                                    this.albums = response.albums;
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

    onCancelarAlbum(id){
        this.confirmado = null;
    }

    onEliminarAlbum(id){
        this._albumService.eliminarAlbum(this.token, id).subscribe(
            response => {
                if(response.albums){
                    alert("Error en el servidor")
                }
                this.obtenerArtista();
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