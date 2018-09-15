import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "../../global";
import { Capitulos } from "../../../models/series/serie/capitulos";

@Injectable()
export class CapituloService{
    public url: string;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    obtenerCapitulos(token, temporadaId = null){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({headers: headers});

        if(temporadaId == null){
            return this._http.get(this.url + 'capitulos/', opciones)
                             .map(res => res.json());
        }else{
            return this._http.get(this.url + 'capitulos/' + temporadaId, opciones)
                             .map(res => res.json());
        }
    }

    obtenerCapitulo(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({headers:headers});

        return this._http.get(this.url + 'capitulo/' + id, opciones)
                         .map(res => res.json());
    }

    nuevoCapitulo(token, capitulo: Capitulos){
        let parametros = JSON.stringify(capitulo);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url+'capitulo', parametros, {headers: headers})
                         .map(res => res.json());
    }

    editarCapitulo(token, id: string, capitulo: Capitulos){
        let parametros = JSON.stringify(capitulo);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'capitulo/'+id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    eliminarCapitulo(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({headers:headers});

        return this._http.delete(this.url+'capitulo/'+id, opciones)
                         .map(res => res.json());
    }
}