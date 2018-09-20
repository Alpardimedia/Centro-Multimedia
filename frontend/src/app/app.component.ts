import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GLOBAL } from "./services/global";

import { UsuariosService } from './services/usuarios/usuarios.service';
import { Usuario } from './models/usuarios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UsuariosService]
})
export class AppComponet implements OnInit{
  public titulo = 'Centro Multimedia';
  public usuario: Usuario;
  public usuario_registro: Usuario;
  public identidad;
  public token;
  public alertaMensaje;
  public url;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuariosService: UsuariosService
  ){
    this.usuario = new Usuario('','','','','','Usuario','');
    this.usuario_registro = new Usuario('','','','','','Usuario','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identidad = this._usuariosService.obtenerIdentidad();
    this.token = this._usuariosService.obtenerToken();
  }

  public onSubmit(){
    console.log(this.usuario);
    
    // Conseguir los datos del usuario identificado
    this._usuariosService.iniciarSesion(this.usuario).subscribe(
      response => {
        let identidad = response.usuario;
        this.identidad = identidad;

        if(!this.identidad._id){
          console.log("Hay problemas al iniciar sesion");
          this.alertaMensaje = "El usuario no está correctamente identificado";
        }else{
          console.log("Usuario inicio sesion");
          
          // Crear el elemento para guardar el usuario en el LocalStorage para que mantenga su sesión
          localStorage.setItem('identidad', JSON.stringify(identidad));

          // Conseguir el token para enviarselo a cada petición Http
          this._usuariosService.iniciarSesion(this.usuario, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
      
              if(this.token.length <= 0){
                this.alertaMensaje = "El token no se ha generado correctamente";
              }else{
                // Crear elementi en el LocalStorage para tener el token disponible
                localStorage.setItem('token', token);
                this.usuario = new Usuario('','','','','','Usuario','');
              }
            },
            error => {
              var mensajeError = <any>error;
      
              if(mensajeError != null){
                var cuerpo = JSON.parse(error._body);
                this.alertaMensaje = cuerpo.mensaje;
      
                console.log(error);          
              }
            }
          );
        }
      },
      error => {
        var mensajeError = <any>error;

        if(mensajeError != null){
          var cuerpo = JSON.parse(error._body);
          this.alertaMensaje = cuerpo.mensaje;

          console.log(error);          
        }
      }
    );
  }

  cerrarSesion(){
    localStorage.removeItem('identidad');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identidad = null;
    this.token = null;
  }

  onSubmitRegistro(){
    console.log(this.usuario_registro);
    
    this._usuariosService.registro(this.usuario_registro).subscribe(
      response => {
        let usuario = response.usuario;
        this.usuario_registro = usuario;

        if(!usuario._id){
          this.alertaMensaje = "No te has registrado";
        }else{
          this.alertaMensaje = "Te has registrado correctamente. Para iniciar sesión use: " + this.usuario_registro.email;
          this.usuario_registro = new Usuario('','','','','','Usuario','');
          this.mostrarLogin();
        }
      },
      error => {
        var mensajeError = <any>error;

        if(mensajeError != null){
          var cuerpo = JSON.parse(error._body);
          this.alertaMensaje = cuerpo.mensaje;

          console.log(error);          
        }
      }
    );
  }

  mostrarRegistro(){
    document.getElementById("formularioIniciarSesion").style.display="none";
    document.getElementById("formularioRegistro").style.display="block";
  }

  mostrarLogin(){
    document.getElementById("formularioIniciarSesion").style.display="block";
    document.getElementById("formularioRegistro").style.display="none";
  }
}