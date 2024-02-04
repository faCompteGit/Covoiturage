require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session');
const server = express();
port = 4001;
server.use(express.json())


//injection des templates ejs
server.set('view engine','ejs');
server.set('views','./views');

//conction à mongodb
const connection = mongoose.connect("mongodb://127.0.0.1:27017/mpglDb")
.then(() => {console.log("connection établie")})
.catch((err) => {console.log("connection erreur" + err.message)})

//session
server.use(session({
    name :  process.env.SESSION_NAME,
    resave : false,
    saveInitialized : false,
    secret : process.env.SESSION_SECRET,
    cookie : {
        maxAge : 3600000,
        secure : false,
    }
}))

server.use(express.urlencoded({extended : true}))


// Configuration des middlewares
server.use(express.urlencoded({ extended: true }));
const protectRoutes =(req,res,next) => {
    if(!req.session.idUser){
        res.render('login');
    }
    else{
        next()
    }

}



server.get('/', async (req,res) => {
    console.log(req.session)
    res.render('login');
})

server.post('/deconnect', async (req,res) => {
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        res.clearCookie(process.env.SESSION_NAME);

        res.redirect('/login');
    })
})

server.get('/pub_trajet',protectRoutes, async (req,res) => {
    res.render('ajouter_trajet');
})



server.use("/trajet",protectRoutes, require("./routes/trajet"));
server.use("/reservation", protectRoutes, require("./routes/reservation"));
server.use("/commentaire", protectRoutes, require("./routes/commentaire"));
server.use("/auth", require("./routes/auth"));


server.listen(port, () => { console.log(`server listening on port ${port}`)})

