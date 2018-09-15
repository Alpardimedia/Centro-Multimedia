import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "../global";
import { Artista } from "../../models/musica/artistas";
import { Album } from "../../models/musica/albums";
import { Disco } from "../../models/musica/discos";
import { Cancion } from "../../models/musica/canciones";

@Injectable()
export class ArtistaService{
    public url: String;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    obtenerArtista(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'artista/' + id, opciones)
                         .map(res => res.json());
    }

    obtenerArtistas(token){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'artistas/', opciones)
                         .map(res => res.json());
    }

    nuevoArtista(token, artista: Artista){
        let parametros = JSON.stringify(artista);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url + 'artista', parametros, {headers: headers})
                         .map(res => res.json());
    }

    editarArtista(token, id: String, artista: Artista){
        let parametros = JSON.stringify(artista);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url + 'artista/' + id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    eliminarArtista(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.delete(this.url + 'artista/' + id, opciones)
                         .map(res => res.json());
    }
}