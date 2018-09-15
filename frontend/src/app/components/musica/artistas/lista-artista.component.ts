import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Artista } from "../../../models/musica/artistas";
import { ArtistaService } from "../../../services/musica/artista.service";


@Component({
    selector: 'lista-artista',
    templateUrl: '../../../views/musica/artistas/lista-artista.html',
    providers: [UsuariosService, ArtistaService]
})

export class ListaArtistaComponent implements OnInit{
    public titulo: string;
    public artistas: Artista[];
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
        this.titulo = 'Artistas';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para listar los artistas. Cargado');
        
        // Conseguiremos el listado de los artistas
        this.obtenerArtistas();
    }

    obtenerArtistas(){
        this._route.params.forEach((params: Params) =>{
            this._artistaService.obtenerArtistas(this.token).subscribe(
                response => {
                    if(!response.artistas){
                        this._router.navigate(['artistas']);
                    }else{
                        this.artistas = response.artistas;
                        document.getElementById('total_artistas').innerHTML = "Total de artistas: " + response.artistas.length;                        
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

    onCancelarArtista(id){
        this.confirmado = null;
    }

    onEliminarArtista(id){
        this._artistaService.eliminarArtista(this.token, id).subscribe(
            response => {
                if(response.artistas){
                    alert("Error en el servidor")
                }
                this._router.navigate(['artistas/']);
                this.obtenerArtistas();
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