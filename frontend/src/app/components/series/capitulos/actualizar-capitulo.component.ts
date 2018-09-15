import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { SubidasService } from "../../../services/subidas.service";
import { Capitulos } from "../../../models/series/serie/capitulos";
import { CapituloService } from "../../../services/series/serie/capitulo.service";


@Component({
    selector: 'actualizar-capitulo',
    templateUrl: '../../../views/series/capitulo/nuevo-capitulo.html',
    providers: [UsuariosService, CapituloService, SubidasService]
})

export class ActualizarCapituloComponent implements OnInit{
    public tituloPagina: String;
    public capitulo: Capitulos;
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
        private _capituloService: CapituloService
    ){
        this.tituloPagina = 'Guardar';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.capitulo = new Capitulos('','','','','','');
        this.para_editar = true;
    }

    ngOnInit(){
        console.log('Componente para editar el capitulo. Cargado');

        // Sacar el capítulo a editar
        this.obtenerCapitulo();
    }

    obtenerCapitulo(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._capituloService.obtenerCapitulo(this.token, id).subscribe(
                response => {
                    if(!response.capitulo){
                        this._router.navigate(['/temporada', response.capitulo.temporada]);
                    }else{
                        this.capitulo = response.capitulo;
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

            this._capituloService.editarCapitulo(this.token, id, this.capitulo).subscribe(
                response => {
                    if(!response.capitulo){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = '¡El capitulo se ha actualizado correctamente!';
                        
                        if(!this.archivosParaSubir){
                            this._router.navigate(['/temporada', response.capitulo.temporada]);
                        }else{
                            // Subir el capitulo de la serie
                            this._subidasService.makeFileRequest(this.url+'subir-archivo-capitulo/'+id, [], this.archivosParaSubir, this.token, 'archivo').then(
                                (result) => {
                                    this._router.navigate(['/temporada', response.capitulo.temporada]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }
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

    public archivosParaSubir;
    fileChangeEvent(fileInput: any){
        this.archivosParaSubir = <Array<File>>fileInput.target.files;
    }
}