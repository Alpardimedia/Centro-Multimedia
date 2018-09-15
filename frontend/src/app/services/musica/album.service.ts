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
export class AlbumService{
    public url: String;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    obtenerAlbum(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.get(this.url + 'album/' + id, opciones)
                         .map(res => res.json());
    }

    obtenerAlbums(token, artistaId = 'null'){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        if(artistaId == null){
            return this._http.get(this.url + 'albums/', opciones)
                         .map(res => res.json());
        }else{
            return this._http.get(this.url + 'albums/' + artistaId, opciones)
                         .map(res => res.json());
        }
    }

    nuevoAlbum(token, album: Album){
        let parametros = JSON.stringify(album);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url + 'album', parametros, {headers: headers})
                         .map(res => res.json());
    }

    editarAlbum(token, id: String, album: Album){
        let parametros = JSON.stringify(album);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url + 'album/' + id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    eliminarAlbum(token, id: String){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        let opciones = new RequestOptions({ headers: headers });

        return this._http.delete(this.url + 'album/' + id, opciones)
                         .map(res => res.json());
    }
}