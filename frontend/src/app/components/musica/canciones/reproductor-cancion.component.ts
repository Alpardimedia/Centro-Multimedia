import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { GLOBAL } from "../../../services/global";
import { UsuariosService } from "../../../services/usuarios/usuarios.service";
import { DiscoService } from "../../../services/musica/disco.service";
import { Disco } from "../../../models/musica/discos";
import { CancionService } from "../../../services/musica/cancion.service";
import { Cancion } from "../../../models/musica/canciones";


@Component({
    selector: 'reproductorCancion',
    template: `
        <div class="reproductorCancionMarco">
            <div class="imagen_album">
                <span *ngIf="cancion.disco">
                    <img id="play-imagen-disco" src="{{url + 'obtener-imagen-album/' + cancion.disco.album.imagen}}">
                </span>

                <span *ngIf="!cancion.disco">
                    <img id="play-imagen-disco" src="../../../../assets/img/default cancion.png">
                </span>
            </div>

            <div class="archivo_cancion">

                <p>Reproduciendo:</p>

                <span id="titulo_cancion">
                    <p>{{cancion.titulo}}</p>
                </span>

                <span id="play_cancion_artista">
                    <div *ngIf="cancion.artista" style="margin-top: 20px;">
                        <p>{{cancion.disco.album.artista.nombre}}</p>
                    </div>
                </span>

                <audio controls id="player">
                    <source id="mp3-source" src="{{url + 'obtener-archivo-cancion/' + cancion.archivo}}" type="audio/mpeg">
                    Tu navegador no es compatible con HTML5
                </audio>
            </div>
        </div>
    `
})

export class ReproductorCancionComponent implements OnInit{
    public cancion: Cancion;
    public url: string;

    constructor(){
        this.url = GLOBAL.url;
        this.cancion = new Cancion('','','','','','');
    }

    ngOnInit(){
        console.log('Reproductor cargado');
    }
}