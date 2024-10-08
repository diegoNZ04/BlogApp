import mongoose from "mongoose"

const Schema = mongoose.Schema

const PostagemSchema = new Schema({
    titulo: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true
    },
    conteudo: {
        type: String,
        require: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

const Postagem = mongoose.model('postagens', PostagemSchema)

export default Postagem