import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Cancion } from "../../../models/musica/canciones";
import { CancionService } from "../../../services/musica/cancion.service";


@Component({
    selector: 'nueva-cancion',
    templateUrl: '../../../views/musica/canciones/nueva-cancion.html',
    providers: [UsuariosService, CancionService]
})

export class NuevaCancionComponent implements OnInit{
    public tituloBoton: string;
    public cancion: Cancion;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _cancionService: CancionService
    ){
        this.tituloBoton = 'Siguiente';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.cancion = new Cancion('','','','','','');
    }

    ngOnInit(){
        console.log('Componente para crear un nueva cancion. Cargado');
    }

    onSubmit(){
        console.log(this.cancion);
        this._route.params.forEach((params: Params) => {
            let discoId = params['disco'];
            this.cancion.disco = discoId;

            this._cancionService.nuevoCancion(this.token, this.cancion).subscribe(
                response => {
                    if(!response.cancion){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'La cancion se ha creado correctamente';
                        this.cancion = response.cancion;
                        this._router.navigate(['/editar-cancion/', response.cancion._id]);
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