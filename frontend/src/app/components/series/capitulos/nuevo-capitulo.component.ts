import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Capitulos } from "../../../models/series/serie/capitulos";
import { CapituloService } from "../../../services/series/serie/capitulo.service";


@Component({
    selector: 'nuevo-capitulo',
    templateUrl: '../../../views/series/capitulo/nuevo-capitulo.html',
    providers: [UsuariosService, CapituloService]
})

export class NuevoCapituloComponent implements OnInit{
    public tituloPagina: string;
    public capitulo: Capitulos;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _capituloService: CapituloService
    ){
        this.tituloPagina = 'Siguiente';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.capitulo = new Capitulos('','','','','','');
    }

    ngOnInit(){
        console.log('Componente para crear un nuevo capitulo. Cargado');
    }
    
    onSubmit(){
        this._route.params.forEach((params: Params) => {
            let temporada_id = params['temporada'];
            this.capitulo.temporada = temporada_id;

            this._capituloService.nuevoCapitulo(this.token, this.capitulo).subscribe(
                response => {
                    if(!response.capitulo){
                        this.alertaMensaje = "Error en el servidor";
                    }else{
                        this.alertaMensaje = "¡El capítulo se ha creado correctamente!";
                        this.capitulo = response.capitulo;

                        this._router.navigate(['/editar-capitulo', response.capitulo._id]);
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