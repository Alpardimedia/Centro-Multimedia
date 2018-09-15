import { Component, OnInit } from "@angular/core";
import { GLOBAL } from "../../services/global";

import { UsuariosService } from "../../services/usuarios/usuarios.service";
import { Usuario } from "../../models/usuarios";

@Component({
    selector: 'editar-usuario',
    templateUrl: '../../views/usuarios/editar-usuario.html',
    providers: [UsuariosService]
})

export class EditarUsuarioComponent implements OnInit{
    public titulo: String;
    public usuario: Usuario;
    public identidad;
    public token;
    public alertaMensaje;
    public url: string

    constructor(
        private _usuariosService: UsuariosService
    ){
        this.titulo = "Actualizar mis datos";

        // LocalStorage
        this.identidad = this._usuariosService.obtenerIdentidad();
        this.token = this._usuariosService.obtenerToken();
        this.usuario = this.identidad;
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('editar-usuario.component.ts cargado');
    }

    onSubmit(){
        console.log(this.usuario);
        
        this._usuariosService.actualizarUsuario(this.usuario).subscribe(
            response => {
                if(!response.usuario){
                    this.alertaMensaje = "El usuario no se ha actualizado";
                }else{
                    //this.usuario = response.usuario;
                    localStorage.setItem('identidad', JSON.stringify(this.usuario));
                    document.getElementById('identidad_nombre').innerHTML = this.usuario.nombre + ' ' + this.usuario.apellido;

                    if(!this.archivosParaSubir){
                        // Redirección
                    }else{
                        this.makeFileRequest(this.url + 'subir-imagen-usuario/' + this.usuario._id, [], this.archivosParaSubir).then(
                            (result: any) => {
                                this.usuario.imagen = result.imagen;
                                localStorage.setItem('identidad', JSON.stringify(this.usuario));

                                let ruta_imagen = this.url + 'obtener-imagen-usuario/' + this.usuario.imagen;
                                document.getElementById('logeo_imagen').setAttribute('src', ruta_imagen);

                                console.log(this.usuario);
                            }
                        );
                    }

                    this.alertaMensaje = "Datos actualizados correctamente.";
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

    public archivosParaSubir: Array<File>;

    fileChangeEvent(fileInput: any){
        this.archivosParaSubir = <Array<File>>fileInput.target.files;
        console.log(this.archivosParaSubir);
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        var token = this.token;

        return new Promise(function(resolve, reject){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i = 0; i < files.length; i++){
                formData.append('imagen', files[i], files[i].name);
            }

            xhr.onreadystatechange= function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response)
                    }
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}