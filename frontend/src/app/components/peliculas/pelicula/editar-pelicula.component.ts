import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { SubidasService } from "../../../services/subidas.service";
import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { PeliculasService } from "../../../services/peliculas/peliculas.service";
import { Pelicula } from "../../../models/peliculas/pelicula";


@Component({
    selector: 'editar-pelicula',
    templateUrl: '../../../views/peliculas/pelicula/nueva-pelicula.html',
    providers: [UsuariosService, PeliculasService, SubidasService]
})

export class EditarPeliculaComponent implements OnInit{
    public tituloPagina: string;
    public pelicula: Pelicula;
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
        private _peliculaService: PeliculasService
    ){
        this.tituloPagina = 'Guardar';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.pelicula = new Pelicula('','','','','','','','','','','','','','');
        this.para_editar = true;
    }

    ngOnInit(){
        console.log('Componente para editar la pelicula. Cargado');

        // Llamar al metodo para sacar una pelicula segun su id
        this.obtenerPelicula();
    }

    obtenerPelicula(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._peliculaService.obtenerPelicula(this.token, id).subscribe(
                response => {
                    if(!response.pelicula){
                        this._router.navigate(['/peliculas']);
                    }else{
                        this.pelicula = response.pelicula;

                        console.log(this.pelicula);
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
        console.log(this.pelicula);
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._peliculaService.editarPelicula(this.token, id, this.pelicula).subscribe(
                response => {
                    if(!response.pelicula){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'La pelicula se ha actualizado correctamente';

                        if(!this.archivosParaSubir){
                            this._router.navigate(['/peliculas']);
                        }else{
                            // Subir la caratura de la pelicula
                            this._subidasService.makeFileRequest(this.url + 'subir-caratura-pelicula/' + id, [], this.archivosParaSubir, this.token, 'caratura').then(
                                (result) => {
                                    this._router.navigate(['/peliculas']);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );

                            // Subir la pelicula
                            this._subidasService.makeFileRequest(this.url + 'subir-pelicula/' + id, [], this.archivosParaSubir, this.token, 'archivo').then(
                                (result) => {
                                    this._router.navigate(['/peliculas']);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }

                        this.pelicula = response.pelicula;
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