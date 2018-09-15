import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { CapituloService } from "../../../services/series/serie/capitulo.service";
import { TemporadaService } from "../../../services/series/serie/temporada.service";
import { Temporada } from "../../../models/series/serie/temporadas";
import { Capitulos } from "../../../models/series/serie/capitulos";


@Component({
    selector: 'ver-temporada',
    templateUrl: '../../../views/series/temporada/ver-temporada.html',
    providers: [UsuariosService, TemporadaService, CapituloService]
})

export class VerTemporadaComponent implements OnInit{
    public temporada: Temporada;
    public capitulos: Capitulos[];
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _capituloService: CapituloService,
        private _temporadaService: TemporadaService
    ){
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para ver el detalle de la temporada. Cargado');

        // Llamar al metodo para sacar una temporada segun su id
        this.obtenerTemporada();
    }

    obtenerTemporada(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._temporadaService.obtenerTemporada(this.token, id).subscribe(
                response => {
                    if(!response.temporada){
                        this._router.navigate(['/serie', response.temporada.serie._id]);
                    }else{
                        this.temporada = response.temporada;

                        // Sacar los capitulos de la serie
                        this._capituloService.obtenerCapitulos(this.token, response.temporada._id).subscribe(
                            response => {
                                if(!response.capitulos){
                                    this.alertaMensaje = "Esta temporada no tiene capitulos";
                                }else{
                                    this.capitulos = response.capitulos;
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

    public confirmado;
    onEliminarConfirmar(id){
        this.confirmado = id;
    }

    onCancelarCapitulo(){
        this.confirmado = null;
    }

    onEliminarCapitulo(id){
        this._capituloService.eliminarCapitulo(this.token, id).subscribe(
            response => {
                if(!response.capitulo){
                    this.alertaMensaje = "Esta temporada no tiene capitulos";
                }

                this.obtenerTemporada();
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
}