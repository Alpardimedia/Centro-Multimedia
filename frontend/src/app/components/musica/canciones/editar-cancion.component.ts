import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { SubidasService } from "../../../services/subidas.service";
import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { CancionService } from "../../../services/musica/cancion.service";
import { Cancion } from "../../../models/musica/canciones";


@Component({
    selector: 'editar-cancion',
    templateUrl: '../../../views/musica/canciones/nueva-cancion.html',
    providers: [UsuariosService, SubidasService, CancionService]
})

export class EditarCancionComponent implements OnInit{
    public tituloBoton: string;
    public cancion: Cancion;
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
        private _cancionService: CancionService
    ){
        this.tituloBoton = 'Guardar';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.cancion = new Cancion('','','','','','');
        this.para_editar = true;
    }

    ngOnInit(){
        console.log('Componente para editar una cancion. Cargado');

        // Llamar al metodo para sacar una cancion segun su id
        this.obtenerCancion();
    }

    obtenerCancion(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._cancionService.obtenerCancion(this.token, id).subscribe(
                response => {
                    if(!response.cancion){
                        this._router.navigate(['/albums']);
                    }else{
                        this.cancion = response.cancion;
                        console.log(this.cancion);
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
        console.log(this.cancion);
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._cancionService.editarCancion(this.token, id, this.cancion).subscribe(
                response => {
                    if(!response.cancion){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'La cancion se ha actualizado correctamente';
                        
                        if(!this.archivosParaSubir){
                            this._router.navigate(['/disco', response.cancion.disco]);
                        }else{
                            // Subir la cancion
                            this._subidasService.makeFileRequest(this.url + 'subir-archivo-cancion/' + id, [], this.archivosParaSubir, this.token, 'archivo').then(
                                (result) => {
                                    this._router.navigate(['/disco', response.cancion.disco]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }

                        this.cancion = response.cancion;
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