import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { SubidasService } from "../../../services/subidas.service";
import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Serie } from "../../../models/series/serie/series";
import { SerieService } from "../../../services/series/serie/serie.service";


@Component({
    selector: 'editar-serie',
    templateUrl: '../../../views/series/serie/nueva-serie.html',
    providers: [UsuariosService, SerieService, SubidasService]
})

export class EditarSerieComponent implements OnInit{
    public tituloPagina: string;
    public serie: Serie;
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
        private _serieService: SerieService
    ){
        this.tituloPagina = 'Guardar';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.serie = new Serie('','','','','');
        this.para_editar = true;
    }

    ngOnInit(){
        console.log('Componente para crear una nueva serie. Cargado');

        // Llamar al metodo para sacar una serie segun su id
        this.obtenerSerie();
    }

    obtenerSerie(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._serieService.obtenerSerie(this.token, id).subscribe(
                response => {
                    if(!response.serie){
                        this._router.navigate(['/series']);
                    }else{
                        this.serie = response.serie;
                        console.log(this.serie);
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
        console.log(this.serie);
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._serieService.editarSerie(this.token, id, this.serie).subscribe(
                response => {
                    if(!response.serie){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'La serie se ha actualizado correctamente';

                        if(!this.archivosParaSubir){
                            this._router.navigate(['/series']);
                        }else{
                            // Subir la imagen de la serie
                            this._subidasService.makeFileRequest(this.url + 'subir-imagen-serie/' + id, [], this.archivosParaSubir, this.token, 'imagen').then(
                                (result) => {
                                    this._router.navigate(['/series']);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }

                        this.serie = response.serie;
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