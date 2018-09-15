import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { SubidasService } from "../../../services/subidas.service";
import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { DiscoService } from "../../../services/musica/disco.service";
import { Disco } from "../../../models/musica/discos";


@Component({
    selector: 'editar-disco',
    templateUrl: '../../../views/musica/discos/nuevo-disco.html',
    providers: [UsuariosService, DiscoService]
})

export class EditarDiscoComponent implements OnInit{
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
        this.tituloBoton = 'Guardar';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.disco = new Disco('','');
    }

    ngOnInit(){
        console.log('Componente para editar un disco. Cargado');

        // Llamar al metodo para sacar una serie segun su id
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
                        console.log(this.disco);
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
        console.log(this.disco);
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._discoService.editarDisco(this.token, id, this.disco).subscribe(
                response => {
                    if(!response.disco){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'El disco se ha actualizado correctamente';

                        this._router.navigate(['/album', response.disco.album]);

                        this.disco = response.disco;
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