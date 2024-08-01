const eAdmin = function(req, res, next){

    if (req.isAuthenticated() && req.usuario.eAdmin == 1){
        return next()
    } else {

        req.flash("error_msg", "Você Precisa Ser Um Admin!")
        res.redirect('/')
        console.log('Precisa Ser Admin')
    
    }
}

export default eAdmin