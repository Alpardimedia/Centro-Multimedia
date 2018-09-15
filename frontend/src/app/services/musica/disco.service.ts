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
export class DiscoService{
    public url: String;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    obtenerDisco(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'disco/' + id, opciones)
                         .map(res => res.json());
    }

    obtenerDiscos(token, albumId = 'null'){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        if(albumId == null){
            return this._http.get(this.url + 'discos/', opciones)
                         .map(res => res.json());
        }else{
            return this._http.get(this.url + 'discos/' + albumId, opciones)
                         .map(res => res.json());
        }
    }

    nuevoDisco(token, disco: Disco){
        let parametros = JSON.stringify(disco);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url + 'disco', parametros, {headers: headers})
                         .map(res => res.json());
    }

    editarDisco(token, id: String, disco: Disco){
        let parametros = JSON.stringify(disco);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url + 'disco/' + id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    eliminarDisco(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.delete(this.url + 'disco/' + id, opciones)
                         .map(res => res.json());
    }
}