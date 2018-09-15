import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Artista } from "../../../models/musica/artistas";
import { ArtistaService } from "../../../services/musica/artista.service";
import { AlbumService } from "../../../services/musica/album.service";
import { Album } from "../../../models/musica/albums";


@Component({
    selector: 'nuevo-album',
    templateUrl: '../../../views/musica/albums/nuevo-album.html',
    providers: [UsuariosService, ArtistaService, AlbumService]
})

export class NuevoAlbumComponent implements OnInit{
    public tituloBoton: string;
    public album: Album;
    public artistas: Artista;
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
        this.tituloBoton = 'Siguiente';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.album = new Album('','','','','','');
    }

    ngOnInit(){
        console.log('Componente para crear un nuevo album. Cargado');
    }

    onSubmit(){
        console.log(this.album);
        this._route.params.forEach((params: Params) => {
            let artista_id = params['artista'];
            this.album.artista = artista_id;

            this._albumService.nuevoAlbum(this.token, this.album).subscribe(
                response => {
                    if(!response.album){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'El album se ha creado correctamente';
                        this.album = response.album;
                        this._router.navigate(['/editar-album/', response.album._id]);
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