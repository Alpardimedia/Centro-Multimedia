import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "../global";

@Injectable()
export class UsuariosService{
    public identidad;
    public token;
    public url: String;

    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    iniciarSesion(usuario_a_login, gethash = null){
        if(gethash != null){
            usuario_a_login.gethash = gethash;
        }

        let json = JSON.stringify(usuario_a_login);
        let parametros = json;

        let headers = new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url + 'login', parametros, {headers: headers})
                         .map(res => res.json());
    }

    registro(usuario_a_registro){
        let json = JSON.stringify(usuario_a_registro);
        let parametros = json;

        let headers = new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url + 'registro', parametros, {headers: headers})
                         .map(res => res.json());
    }

    actualizarUsuario(usuario_a_actualizar){
        let json = JSON.stringify(usuario_a_actualizar);
        let parametros = json;

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': this.obtenerToken()
        });

        return this._http.put(this.url + 'actualizar-usuario/' + usuario_a_actualizar._id, parametros, {headers: headers})
                         .map(res => res.json());
    }

    obtenerIdentidad(){
        let identidad = JSON.parse(localStorage.getItem('identidad'));

        if(identidad != "undefined"){
            this.identidad = identidad;
        }else{
            this.identidad = null;
        }

        return this.identidad;
    }

    obtenerToken(){
        let token = localStorage.getItem('token');

        if(token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }
}