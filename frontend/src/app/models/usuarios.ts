export class Usuario{
    constructor(
        public _id: String,
        public nombre: String,
        public apellido: String,
        public email: String,
        public password: String,
        public rol: String,
        public imagen: String
    ){}
}