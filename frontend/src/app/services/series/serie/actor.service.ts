import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "../../global";
import { Actor } from "../../../models/series/serie/actores";
import { Serie } from "../../../models/series/serie/series";

@Injectable()
export class ActorService{
    public url: String;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    obtenerActores(token, serieId = null){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({headers: headers});

        if(serieId == null){
            return this._http.get(this.url + 'actores', opciones)
                             .map(res => res.json());
        }else{
            return this._http.get(this.url + 'actores/' + serieId, opciones)
                             .map(res => res.json());
        }
    }

    obtenerActor(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'actor/' + id, opciones)
                         .map(res => res.json());
    }

    getActoresSeries(token){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({headers: headers});

        return this._http.get(this.url + 'actores-serie', opciones)
                             .map(res => res.json());
    }

    nuevoActor(token, actor: Actor){
        let parametros = JSON.stringify(actor);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url + 'actor', parametros, {headers: headers})
                         .map(res => res.json());
    }

    nuevaSerieActor(token, serie: Serie){
        let parametros = JSON.stringify(serie);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url + 'serie', parametros, {headers: headers})
                         .map(res => res.json());
    }

    editarActor(token, id: string, actor: Actor){
        let parametros = JSON.stringify(actor);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url + 'actor/' + id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    eliminarActor(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.delete(this.url + 'actor/' + id, opciones)
                         .map(res => res.json());
    }
}