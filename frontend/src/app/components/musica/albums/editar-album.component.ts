import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { SubidasService } from "../../../services/subidas.service";
import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { AlbumService } from "../../../services/musica/album.service";
import { Album } from "../../../models/musica/albums";


@Component({
    selector: 'editar-album',
    templateUrl: '../../../views/musica/albums/nuevo-album.html',
    providers: [UsuariosService, SubidasService, AlbumService]
})

export class EditarAlbumComponent implements OnInit{
    public tituloBoton: string;
    public album: Album;
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
        private _albumService: AlbumService
    ){
        this.tituloBoton = 'Guardar';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.album = new Album('','','','','','');
        this.para_editar = true;
    }

    ngOnInit(){
        console.log('Componente para editar un album. Cargado');

        // Llamar al metodo para sacar una serie segun su id
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
                        console.log(this.album);
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
        console.log(this.album);
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._albumService.editarAlbum(this.token, id, this.album).subscribe(
                response => {
                    if(!response.album){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'El album se ha actualizado correctamente';
                        
                        if(!this.archivosParaSubir){
                            this._router.navigate(['/artista', response.album.artista]);
                        }else{
                            // Subir la imagen del artista
                            this._subidasService.makeFileRequest(this.url + 'subir-imagen-album/' + id, [], this.archivosParaSubir, this.token, 'imagen').then(
                                (result) => {
                                    this._router.navigate(['/artista', response.album.artista]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }

                        this.album = response.album;
                    }
                },
                error => {
                    var mensajeError = <any>error;

                    if(mensajeError != null){
                        var cuerpo = JSON.parse(error._body);
                        //this.alertaMensaje = cuerpo.mensaje;

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