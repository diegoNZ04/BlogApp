import { Router } from 'express'
import bcrypt from "bcryptjs"
import Usuario from '../models/Usuario.js'
import passport from 'passport'

const usuario = Router()

usuario.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

usuario.post('/registro', (req, res) => {
    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome Inválido."})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email Inválido."})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha Inválida."})
    }

    if(req.body.senha.length < 4){
        erros.push({texto: "Senha Inválida."})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As Senhas Não São Iguais. Tente Novamente."})
    }

    if(erros.length > 0){
        res.render('usuarios/registro', {erros: erros})

    } else {
        
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Já Existe Uma Conta Com Este Email!")
                res.redirect('/usuario/registro')

            } else {

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (error, hash) => {
                        if(error){
                            req.flash("error_msg", "Houve Um Error Durante O Salvamento do Usuário")
                            res.redirect('/')
                            console.log(`error_msg", "Houve Um Error Durante O Salvamento do Usuário: ${error}`)
                        } else {

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário Criado Com Sucesso!")
                            res.redirect('/')

                        }).catch((error) => {
                            req.flash("error_msg", "Houve Um Erro Na Criação do Usuário. Tente Novamente!")
                            res.redirect('/')
                            console.log(`Houve Um Erro Na Criação do Usuário: ${error}`)

                        })
                        }

                    })
                })

            }
        }).catch((error) => {
            req.flash("error_msg", "Houve Um Erro Interno")
            res.redirect('/')
            console.log(`Houve Um Erro Interno: ${error}`)
        })

    }
})

usuario.get('/login', (req, res) => {
    res.render("usuarios/login")
})

usuario.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next)

})

usuario.get('/logout', (req, res) => {
    req.logout(() => {
      req.flash('success_msg', 'Deslogado com sucesso!')
      res.redirect('/')
    })
  })

export default usuario