import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Serie } from "../../../models/series/serie/series";
import { Temporada } from "../../../models/series/serie/temporadas";
import { TemporadaService } from "../../../services/series/serie/temporada.service";
import { SubidasService } from "../../../services/subidas.service";


@Component({
    selector: 'editar-temporada',
    templateUrl: '../../../views/series/temporada/nueva-temporada.html',
    providers: [UsuariosService, TemporadaService, SubidasService]
})

export class EditarTemporadaComponent implements OnInit{
    public tituloBoton: string;
    public temporada: Temporada;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;
    public para_editar;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _subidasService: SubidasService,
        private _usuarioService: UsuariosService,
        private _temporadaService: TemporadaService
    ){
        this.tituloBoton = 'Guardar';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.temporada = new Temporada('','','','');
        this.para_editar = true;
    }

    ngOnInit(){
        console.log('Componente para editar una temporada. Cargado');

        // Conseguir la temporada
        this.obtenerTemporada();
    }

    obtenerTemporada(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._temporadaService.obtenerTemporada(this.token, id).subscribe(
                response => {
                    if(!response.temporada){
                        this._router.navigate(['/temporada', this.temporada.serie]);
                    }else{
                        this.temporada = response.temporada;
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
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._temporadaService.editarTemporada(this.token, id, this.temporada).subscribe(
                response => {
                    if(!response.temporada){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'La temporada se ha actualizado correctamente';
                        
                        if(!this.archivosParaSubir){
                            this._router.navigate(['/serie', response.temporada.serie]);
                        }else{
                            // Subir la imagen de la serie
                            this._subidasService.makeFileRequest(this.url + 'subir-imagen-temporada/' + id, [], this.archivosParaSubir, this.token, 'imagen').then(
                                (result) => {
                                    this._router.navigate(['/serie', response.temporada.serie]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }

                        this.temporada = response.temporada;
                        this._router.navigate(['/serie', response.temporada.serie]);
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

    public archivosParaSubir: Array<File>;

    fileChangeEvent(fileInput: any){
        this.archivosParaSubir = <Array<File>>fileInput.target.files;
    }
}