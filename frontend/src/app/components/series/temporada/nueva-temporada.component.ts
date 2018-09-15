import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { SerieService } from "../../../services/series/serie/serie.service";
import { Serie } from "../../../models/series/serie/series";
import { Temporada } from "../../../models/series/serie/temporadas";
import { TemporadaService } from "../../../services/series/serie/temporada.service";


@Component({
    selector: 'nueva-temporada',
    templateUrl: '../../../views/series/temporada/nueva-temporada.html',
    providers: [UsuariosService, SerieService, TemporadaService]
})

export class NuevaTemporadaComponent implements OnInit{
    public tituloBoton: string;
    public serie: Serie;
    public temporada: Temporada;
    public identidad;
    public token;
    public url: string;
    public alertaMensaje;
    public para_editar;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuariosService,
        private _serieService: SerieService,
        private _temporadaService: TemporadaService
    ){
        this.tituloBoton = 'Siguiente';
        this.identidad = this._usuarioService.obtenerIdentidad();
        this.token = this._usuarioService.obtenerToken();
        this.url = GLOBAL.url;
        this.para_editar = false;
        this.temporada = new Temporada('','','','');
    }

    ngOnInit(){
        console.log('Componente para crear una nueva temporada. Cargado');
    }

    onSubmit(){
        
        this._route.params.forEach((params: Params) => {
            let serie_id = params['serie'];
            this.temporada.serie = serie_id;

            this._temporadaService.nuevaTemporada(this.token, this.temporada).subscribe(
                response => {
                    if(!response.temporada){
                        this.alertaMensaje = 'Error en el servidor';
                    }else{
                        this.alertaMensaje = 'La temporada se ha creado correctamente';
                        this.temporada = response.temporada;
                        this._router.navigate(['/editar-temporada/', response.temporada._id]);
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