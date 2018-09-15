import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { Capitulos } from "../../../models/series/serie/capitulos";
import { CapituloService } from "../../../services/series/serie/capitulo.service";
import { Temporada } from "../../../models/series/serie/temporadas";
import { TemporadaService } from "../../../services/series/serie/temporada.service";
import { Serie } from "../../../models/series/serie/series";
import { SerieService } from "../../../services/series/serie/serie.service";


@Component({
    selector: 'reproductorCapitulo',
    templateUrl: '../../../views/series/capitulo/reproductor.html',
    providers: [UsuariosService, CapituloService, TemporadaService, SerieService]
})

export class ReproductorComponent implements OnInit{
    public capitulo: Capitulos;
    public temporadas: Temporada;
    public series: Serie;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _temporadaService: TemporadaService,
        private _serieService: SerieService,
        private _capituloService: CapituloService
    ){
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Componente para crear un nuevo capitulo. Cargado');

        this.obtenerCapitulo();
    }
    
    obtenerCapitulo(){
        this._route.params.forEach((params: Params) =>{
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
}