import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "../../global";
import { Temporada } from "../../../models/series/serie/temporadas";

@Injectable()
export class TemporadaService{
    public url: string;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    obtenerTemporadas(token, serieId = null){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({headers: headers});

        if(serieId == null){
            return this._http.get(this.url + 'temporadas/', opciones)
                             .map(res => res.json());
        }else{
            return this._http.get(this.url + 'temporadas/' + serieId, opciones)
                             .map(res => res.json());
        }
    }

    obtenerTemporada(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({headers: headers});
        
        return this._http.get(this.url + 'temporada/' + id, opciones)
                         .map(res => res.json());
    }

    nuevaTemporada(token, temporada: Temporada){
        let parametros = JSON.stringify(temporada);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url + 'temporada', parametros, {headers: headers})
                         .map(res => res.json());
    }

    editarTemporada(token, id: string, temporada: Temporada){
        let parametros = JSON.stringify(temporada);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url + 'temporada/' + id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    eliminarTemporada(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({headers: headers});
        
        return this._http.delete(this.url + 'temporada/' + id, opciones)
                         .map(res => res.json());
    }
}