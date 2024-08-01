import mongoose from "mongoose"

const Schema = mongoose.Schema

const CategoriaSchema = new Schema({
    nome: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    }, 
    date: {
        type: Date,
        default: Date.now()
    }
})

const Categoria = mongoose.model('categorias', CategoriaSchema)

export default Categoria
