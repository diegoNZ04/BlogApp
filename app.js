// Importações
    import express from 'express'
    import { engine } from 'express-handlebars'
    import mongoose from 'mongoose'
    import path from 'path'
    import session from 'express-session'
    import flash from 'connect-flash'
    import passport from 'passport'
    import admin from './routes/admin.js'
    import usuario from './routes/usuario.js'
    import Postagem from './models/Postagem.js'
    import Categoria from './models/Categoria.js'
    import auth from './config/auth.js'
    import eAdmin from './helpers/eAdmin.js'
    
    

    
// Constantes Principais 
    const app = express()
    const __dirname = path.resolve()
    const PORT = 8081

// Config
    // Sessão
    app.use(session({
        secret: 'cursodenode',
        resave: true,
        saveUninitialized: true,
        cookie: {secure: true}
    }))
    

    // Passport
    auth(passport);
    app.use(passport.initialize())
    app.use(passport.session())
    
    app.use(flash())

    // Envio Info, Clientes Externos
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

    // Middleware
      app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg"),
        res.locals.error = req.flash("error")
        res.locals.usuario = req.usuario || null
        res.locals.eAdmin = eAdmin || null
        next()
    })

    // Handlebars
    app.engine('handlebars', engine({
        defaultLayout:'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    }))
    app.set('view engine', 'handlebars')

    // Moongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/blogapp').then(() => {
        console.log('MongoDB Conectado.')
    }).catch((error) => {
        console.log(`Houve um erro ao se conectar ao MongoDB: ${error}`)
    })

    // Public
    app.use(express.static(path.join(__dirname, 'public')))

// Rotas
    app.use('/admin', admin)

    app.use('/usuario', usuario)

    app.get('/', (req, res) => {
        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens: postagens})
        }).catch((error) => {
            req.flash("error_msg", "Houve Um Erro Interno")
            res.redirect("/404")
            console.log(`Houve Um Erro Interno: ${error}`)
        })
    })

    app.get('/postagens/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem) {
                res.render('postagem/slugpostagem', {postagem: postagem})
            } else {
                req.flash("error_msg", "Esta Postagem Não Existe.")
                res.redirect('/')
                console.log("Postagem Não Existe.")
            }
        }).catch((error) => {
            req.flash("error_msg", "Houve Um Erro Interno")
            res.redirect('/')
            console.log(`Houve Um Erro Interno: ${error}`)
        })
    })


    app.get('/categorias', (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render('categorias/index', {categorias: categorias})

        }).catch((error) => {
            req.flash("error_msg", "Houve Um Erro Interno Ao Listar As Categorias")
            res.redirect('/')
            console.log(`Houve Um Erro Interno Ao Listar As Categorias: ${error}`)
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria) {

                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {

                    res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
                }).catch((error) => {
                    req.flash("error_msg", "Houve Um Erro Ao Listar Os Posts!")
                    console.log(`Houve Um Erro Ao Listar Os Posts: ${error}`)
                })

            } else {
                req.flash("error_msg", "Esta Categoria Não Existe")
                res.redirect("/")
                console.log(`Esta Categoria Não Existe`)
            }

        }).catch((error) => {
            req.flash("error_msg", "Houve Um Erro Interno Ao Carregar A Página Desta Categoria")
            res.redirect('/')
            console.log(`Houve Um Erro Interno Ao Carregar A Página Desta Categoria: ${error}`)
        })
    })

    app.get('/404', (req, res) => {
        res.send('ERRO 404!')
    })

// Outros

app.listen(PORT, () => {
    console.log('Servidor Rodando!')
})