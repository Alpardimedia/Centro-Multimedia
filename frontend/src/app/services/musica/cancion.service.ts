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
export class CancionService{
    public url: String;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    obtenerCancion(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'cancion/' + id, opciones)
                         .map(res => res.json());
    }

    obtenerCanciones(token, discoId = 'null'){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        if(discoId == null){
            return this._http.get(this.url + 'canciones/', opciones)
                         .map(res => res.json());
        }else{
            return this._http.get(this.url + 'canciones/' + discoId, opciones)
                         .map(res => res.json());
        }
    }

    nuevoCancion(token, cancion: Cancion){
        let parametros = JSON.stringify(cancion);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url + 'cancion', parametros, {headers: headers})
                         .map(res => res.json());
    }

    editarCancion(token, id: String, cancion: Cancion){
        let parametros = JSON.stringify(cancion);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url + 'cancion/' + id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    eliminarCancion(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.delete(this.url + 'cancion/' + id, opciones)
                         .map(res => res.json());
    }
}