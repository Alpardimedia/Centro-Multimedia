import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { DiscoService } from "../../../services/musica/disco.service";
import { Disco } from "../../../models/musica/discos";
import { CancionService } from "../../../services/musica/cancion.service";
import { Cancion } from "../../../models/musica/canciones";


@Component({
    selector: 'ver-disco',
    templateUrl: '../../../views/musica/discos/ver-disco.html',
    providers: [UsuariosService, DiscoService, CancionService]
})

export class VerDiscoComponent implements OnInit{
    public canciones: Cancion[];
    public disco: Disco[];
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _discoService: DiscoService,
        private _cancionService: CancionService
    ){
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para ver el detalle de los albums. Cargado');

        // Llamar al metodo para sacar un album segun su id
        this.obtenerDisco();
    }

    obtenerDisco(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._discoService.obtenerDisco(this.token, id).subscribe(
                response => {
                    if(!response.disco){
                        this._router.navigate(['/discos']);
                    }else{
                        this.disco = response.disco;

                        // Sacar las canciones del disco
                        this._cancionService.obtenerCanciones(this.token, response.disco._id).subscribe(
                            response => {
                                if(!response.canciones){
                                    this.alertaMensaje = "Este disco no tiene canciones";
                                }else{
                                    this.canciones = response.canciones;
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

    comenzarCancion(cancion){
        let reproducir_cancion = JSON.stringify(cancion);
        let ruta_cancion = this.url + 'obtener-archivo-cancion/' + cancion.archivo;
        let ruta_imagen = this.url + 'obtener-imagen-album/' + cancion.disco.album.imagen;

        localStorage.setItem('sonido_cancion', reproducir_cancion);
        
        document.getElementById("mp3-source").setAttribute("src", ruta_cancion);
        (document.getElementById("player") as any).load();
        (document.getElementById("player") as any).play();

        document.getElementById('titulo_cancion').innerHTML = cancion.nombre + '<br>';
        document.getElementById('play_cancion_artista').innerHTML = cancion.disco.album.artista.nombre;
        document.getElementById('play-imagen-disco').setAttribute("src", ruta_imagen);
        document.getElementById('letra_cancion').innerHTML = '<h3>Letra de la cancion</h3>' + '<p class="letra_cancion" >' + cancion.letra + '</p>';
    }

    public confirmado;

    onCancelarCancion(id){
        this.confirmado = null;
    }

    onEliminarCancion(id){
        this._cancionService.eliminarCancion(this.token, id).subscribe(
            response => {
                if(!response.canciones){
                    this.alertaMensaje = "Error en el servidor";
                }
                
                this.obtenerDisco();
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
    }

    onEliminarConfirmar(id){
        this.confirmado = id;
    }
}