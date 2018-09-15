import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { SubidasService } from "../../../services/subidas.service";
import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { ArtistaService } from "../../../services/musica/artista.service";
import { Artista } from "../../../models/musica/artistas";


@Component({
    selector: 'editar-artista',
    templateUrl: '../../../views/musica/artistas/nuevo-artista.html',
    providers: [UsuariosService, SubidasService, ArtistaService]
})

export class EditarArtistaComponent implements OnInit{
    public tituloPagina: string;
    public artista: Artista;
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
        private _artistaService: ArtistaService
    ){
        this.tituloPagina = 'Guardar';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.artista = new Artista('','','','');
        this.para_editar = true;
    }

    ngOnInit(){
        console.log('Componente para editar un artista. Cargado');

        // Llamar al metodo para sacar una serie segun su id
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
                        console.log(this.artista);
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
        console.log(this.artista);
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._artistaService.editarArtista(this.token, id, this.artista).subscribe(
                response => {
                    if(!response.artista){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'El artista se ha actualizado correctamente';
                        
                        if(!this.archivosParaSubir){
                            this._router.navigate(['/artistas']);
                        }else{
                            // Subir la imagen del artista
                            this._subidasService.makeFileRequest(this.url + 'subir-imagen-artista/' + id, [], this.archivosParaSubir, this.token, 'imagen').then(
                                (result) => {
                                    this._router.navigate(['/artistas']);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }

                        this.artista = response.artista;
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