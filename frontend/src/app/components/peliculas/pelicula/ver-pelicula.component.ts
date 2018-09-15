import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { PeliculasService } from "../../../services/peliculas/peliculas.service";
import { Pelicula } from "../../../models/peliculas/pelicula";


@Component({
    selector: 'ver-pelicula',
    templateUrl: '../../../views/peliculas/pelicula/ver-pelicula.html',
    providers: [UsuariosService, PeliculasService]
})

export class VerPeliculaComponent implements OnInit{
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
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para ver el detalle de la pelicula. Cargado');

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