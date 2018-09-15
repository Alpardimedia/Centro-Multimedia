import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Artista } from "../../../models/musica/artistas";
import { ArtistaService } from "../../../services/musica/artista.service";
import { AlbumService } from "../../../services/musica/album.service";
import { Album } from "../../../models/musica/albums";


@Component({
    selector: 'lista-album',
    templateUrl: '../../../views/musica/albums/lista-album.html',
    providers: [UsuariosService, ArtistaService, AlbumService]
})

export class ListaAlbumComponent implements OnInit{
    public titulo: string;
    public albums: Album;
    public artistas: Artista[];
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
        this.titulo = 'Albums';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para listar los albums de los artistas. Cargado');
        
        // Conseguiremos el listado de los artistas
        this.obtenerAlbums();
    }

    obtenerAlbums(){
        this._route.params.forEach((params: Params) =>{
            this._albumService.obtenerAlbums(this.token).subscribe(
                response => {
                    if(!response.albums){
                        this._router.navigate(['/']);
                    }else{
                        this.albums = response.albums;
                        document.getElementById('total_artistas').innerHTML = "Total de artistas: " + response.album.length;                        
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
                this._router.navigate(['albums/']);
                this.obtenerAlbums();
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