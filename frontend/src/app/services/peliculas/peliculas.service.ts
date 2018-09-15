import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "../global";
import { Pelicula } from "../../models/peliculas/pelicula";

@Injectable()
export class PeliculasService{
    public url: String;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    obtenerPelicula(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'pelicula/' + id, opciones)
                         .map(res => res.json());
    }

    obtenerPeliculas(token){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'peliculas/', opciones)
                         .map(res => res.json());
    }

    nuevaPelicula(token, pelicula: Pelicula){
        let parametros = JSON.stringify(pelicula);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url + 'pelicula', parametros, {headers: headers})
                         .map(res => res.json());
    }

    editarPelicula(token, id: String, pelicula: Pelicula){
        let parametros = JSON.stringify(pelicula);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url + 'pelicula/' + id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    eliminarPelicula(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.delete(this.url + 'pelicula/' + id, opciones)
                         .map(res => res.json());
    }
}