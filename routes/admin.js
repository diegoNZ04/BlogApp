import { Router } from 'express'
import Categoria from '../models/Categoria.js'
import Postagem from '../models/Postagem.js'
import eAdmin from '../helpers/eAdmin.js'


const admin = Router()

admin.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})

admin.get('/postagens', eAdmin, (req, res) => {

    Postagem.find().lean().populate('categoria').sort({data: "desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }). catch((error) => {
        req.flash("error_msg", "Houve Um Erro Ao Listar As Postagens")
        res.redirect("/admin")
        console.log(`Houve Um Erro Ao Listar As Postagens ${error}`)
    })
})

admin.get('/postagens/add', eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/addpostagens', {categorias: categorias})
    }).catch((error) => {
        req.flash('error_msg', 'Houve Um Erro Ao Carregar O Formulário')
        res.redirect('/admin')
        console.log(`Houve Um Erro Ao Carregar O Formulário: ${error}`)
    })
})

admin.post('/postagens/nova', eAdmin, (req, res) => {
    let erros = []

    if(req.body.categoria == '0') {
        erros.push({texto: 'Categoria Inválida. Registe Uma Categoria'})
    }

    if (erros.length > 0) {
        res.render('admin/addpostagens', {erros: erros})
    } else {
        const novaPostagem = new Postagem ({
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        })
        novaPostagem.save().then(() => {
            req.flash('success_msg', 'Postagem Criada Com Sucesso!')
            res.redirect('/admin/postagens')
        }).catch((error) => {
            req.flash('error_msg', 'Houve Um Erro. Tente Novamente.')
            res.redirect('/admin/postagens')
            console.log(`Houve Um Erro Na Postagem: ${error}`)
        })
    }
})

admin.get('/postagens/edit/:id', eAdmin, (req, res) => {

    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {

        Categoria.find().lean().then((categorias) => {
            res.render('admin/editpostagens', {categorias: categorias, postagem: postagem})
        }).catch((error) => {
            req.flash("error_msg", "Houve Um Erro Ao Listar As Categorias")
            res.redirect("/admin/postagens")
            console.log(`Houve Um Erro Ao Listar As Categorias: ${error}`)
        })

    }).catch((error) => {
        req.flash('error_msg', 'Houve Um Erro Ao Carregar O Formulário de Edição')
        res.redirect('/admin/postagens')
        console.log(`Houve Um Erro Ao Carregar O Formulário de Edição: ${error}`)
    })
})

admin.post('/postagens/edit', eAdmin, (req, res) => {
    let erros = []

    if(req.body.categoria == '0') {
        erros.push({texto: 'Categoria Inválida. Registe Uma Categoria'})
    }

    if (erros.length > 0) {
        res.render('admin/postagens', {erros: erros})
    } else {
        Postagem.findOne({_id: req.body.id}).then((postagem) =>{

            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                req.flash("success_msg", "Postagem Editada Com Sucesso!")
                res.redirect('/admin/postagens')
            }).catch((error) => {
                req.flash("error_msg", "Houve Um Erro Interno")
                res.redirect('/admin/postagens')
                console.log(`Houve Um Erro Interno ${error}`)
            })

        }).catch((error) => {
            req.flash("error_msg", "Houve Um Erro Ao Salvar A Edição")
            res.redirect('/admin/postagens')
            console.log(`Houve Um Erro Ao Salvar A Edição: ${error}`)
        })
    }
})

admin.get('/postagens/deletar/:id', eAdmin, (req, res) => {
    Postagem.findOneAndDelete({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Postagem Deletada Com Sucesso!")
        res.redirect('/admin/postagens')
    }).catch((error) => {
        req.flash('error_msg', 'Houve Um Erro Interno')
        res.redirect('/admin/postagens')
        console.log(`Houve Um Erro Interno: ${error}`)
    })
})

admin.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar categorias')
        res.redirect('/admin/categorias')
    })
})

admin.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addcategorias')
})

admin.post('/categorias/nova', eAdmin, (req, res) => {

    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome Inválido."})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: 'Slug Inválido'})
    }

    if (req.body.nome.length < 2) {
        erros.push({texto: 'Nome da Categoria Não Tem O Número de Caracteres Necessários'})
    }

    if (erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    } else {
        const novaCategoria = new Categoria({
            nome: req.body.nome,
            slug: req.body.slug
        })
        novaCategoria.save().then(() => {
            req.flash('success_msg', 'Categoria Criada Com Sucesso!')
            res.redirect('/admin/categorias')
        }).catch((error) => {
            req.flash('error_msg', 'Houve Um Erro. Tente Novamente.')
            res.redirect('/admin')
            console.log(`Houve Um Erro Na Nova Categoria: ${error}`)
        })
    }
})

admin.get('/categorias/edit/:id', eAdmin, (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categorias) => {
        res.render('admin/editcategorias', {categorias: categorias})
    }).catch((error) => {
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/categorias')
        console.log(`Houve Um Erro Na Rota de ID das Categorias: ${error}`)
    })
})

admin.post('/categorias/edit', eAdmin, (req, res) => {

    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome Inválido."})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: 'Slug Inválido'})
    }

    if (req.body.nome.length < 2) {
        erros.push({texto: 'Nome da Categoria Não Tem O Número de Caracteres Necessários'})
    }

    if (erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    } else {
        Categoria.findOne({_id: req.body.id}).then((categoria) => {

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
    
            categoria.save().then(() => {
                req.flash('success_msg', 'Categoria Editada Com Sucesso.')
                res.redirect('/admin/categorias')
            }).catch((error) => {
                req.flash('error_msg', 'Houve Um Erro Interno Ao Salvar A Categoria')
                res.redirect('/admin/categorias')
            })
    
        }).catch((error) => {
            req.flash('error_msg', 'Houve Um Erro Ao Editar A Categoria')
            res.redirect('/admin/categorias')
            console.log(`Houve Um Erro Na Edição das Categorias: ${error}`)
        })
    }
})

admin.post('/categorias/deletar', eAdmin, (req, res) => {
    Categoria.findOneAndDelete({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria Removida Com Sucesso!')
        res.redirect('/admin/categorias')
    }).catch((error) => {
        req.flash('error_msg', 'Houve Um Erro Ao Remover A Categoria!')
        res.redirect('/admin/categorias') 
        console.log(`Houve Um Erro Em Deletar A Categoria: ${error}`)
    }) 
})

export default admin