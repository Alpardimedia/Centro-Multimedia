import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Artista } from "../../../models/musica/artistas";
import { ArtistaService } from "../../../services/musica/artista.service";


@Component({
    selector: 'nuevo-artista',
    templateUrl: '../../../views/musica/artistas/nuevo-artista.html',
    providers: [UsuariosService, ArtistaService]
})

export class NuevoArtistaComponent implements OnInit{
    public tituloPagina: string;
    public artista: Artista;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _artistaService: ArtistaService
    ){
        this.tituloPagina = 'Siguiente';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.artista = new Artista('','','','');
    }

    ngOnInit(){
        console.log('Componente para crear un nuevo artista. Cargado');
    }

    onSubmit(){
        console.log(this.artista);
        this._route.params.forEach((params: Params) => {

            this._artistaService.nuevoArtista(this.token, this.artista).subscribe(
                response => {
                    if(!response.artista){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'El artista se ha creado correctamente';
                        this.artista = response.artista;
                        
                        this._router.navigate(['/editar-artista/', response.artista._id]);
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