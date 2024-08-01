import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UsuarioSchema = new Schema({
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    eAdmin: {
        type: Number,
        default: 1
    },
    senha: {
        type: String,
        require: true
    }
})

const Usuario = mongoose.model('usuarios', UsuarioSchema)

export default Usuario