import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { PeliculasService } from "../../../services/peliculas/peliculas.service";
import { Pelicula } from "../../../models/peliculas/pelicula";


@Component({
    selector: 'nueva-pelicula',
    templateUrl: '../../../views/peliculas/pelicula/nueva-pelicula.html',
    providers: [UsuariosService, PeliculasService]
})

export class NuevaPeliculaComponent implements OnInit{
    public tituloPagina: string;
    public pelicula: Pelicula;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _peliculaService: PeliculasService
    ){
        this.tituloPagina = 'Siguiente';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.pelicula = new Pelicula('','','','','','','','','','','','','','');
    }

    ngOnInit(){
        console.log('Componente para crear nueva pelicula. Cargado');
    }

    onSubmit(){
        console.log(this.pelicula);
        this._route.params.forEach((params: Params) => {

            this._peliculaService.nuevaPelicula(this.token, this.pelicula).subscribe(
                response => {
                    if(!response.pelicula){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'La película se ha creado correctamente';
                        this.pelicula = response.pelicula;
                        
                        this._router.navigate(['/editar-pelicula/', response.pelicula._id]);
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