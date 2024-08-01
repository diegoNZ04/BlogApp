import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs"
import Usuario from '../models/Usuario.js'

const Passport = function(passport){

    passport.use(new LocalStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done) =>{

        Usuario.findOne({email: email}).lean().then((usuario) => {
            if(!usuario){
                return done(null, false, {message: "Esta Conta Não Existe"})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {

                if(batem){
                    return done (null, usuario)
                } else {
                    return done (null, false, {message: "Senha Incorreta"})
                }

            })

        })


        
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario._id)
    })
    
    passport.deserializeUser((id, done) => {
        Usuario.findById(id).lean().then((usuario) => {
            done(null, usuario)
        }).catch((error)=>{
            done(null, false, {message:'Houve Um Erro'})
            console.log(`Houve Um Erro: ${error}`)
        })
    })

}


export default Passport