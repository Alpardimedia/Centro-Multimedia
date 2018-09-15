import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { DiscoService } from "../../../services/musica/disco.service";
import { Disco } from "../../../models/musica/discos";


@Component({
    selector: 'nuevo-disco',
    templateUrl: '../../../views/musica/discos/nuevo-disco.html',
    providers: [UsuariosService, DiscoService]
})

export class NuevoDiscoComponent implements OnInit{
    public tituloBoton: string;
    public disco: Disco;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _discoService: DiscoService
    ){
        this.tituloBoton = 'Siguiente';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.disco = new Disco('','');
    }

    ngOnInit(){
        console.log('Componente para crear un nuevo disco. Cargado');
    }

    onSubmit(){
        console.log(this.disco);
        this._route.params.forEach((params: Params) => {
            let album_id = params['album'];
            this.disco.album = album_id;

            this._discoService.nuevoDisco(this.token, this.disco).subscribe(
                response => {
                    if(!response.disco){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'El disco se ha creado correctamente';
                        this.disco = response.disco;
                        
                        this._router.navigate(['/editar-disco/', response.disco._id]);
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