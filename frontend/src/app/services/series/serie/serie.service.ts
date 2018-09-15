import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "../../global";
import { Serie } from "../../../models/series/serie/series";

@Injectable()
export class SerieService{
    public url: String;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    obtenerSeries(token){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'series', opciones)
                         .map(res => res.json());
    }

    obtenerSerie(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'serie/' + id, opciones)
                         .map(res => res.json());
    }

    getSeries(token, actorId = null){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({headers: headers});

        if(actorId == null){            
            return this._http.get(this.url + 'actor/', opciones)
                             .map(res => res.json());
        }else{
            return this._http.get(this.url + 'actor/' + actorId, opciones)
                             .map(res => res.json());
        }
    }

    nuevaSerie(token, serie: Serie){
        let parametros = JSON.stringify(serie);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url + 'serie', parametros, {headers: headers})
                         .map(res => res.json());
    }

    editarSerie(token, id: string, serie: Serie){
        let parametros = JSON.stringify(serie);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url + 'serie/' + id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    eliminarSerie(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.delete(this.url + 'serie/' + id, opciones)
                         .map(res => res.json());
    }
}