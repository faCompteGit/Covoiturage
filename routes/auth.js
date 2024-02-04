const express = require('express');
const router = express.Router();
const User =require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");
require('dotenv').config();


/***********************Voir tous les utilisateurs */
router.get('/users', async (req,res) => {
   const users = await User.find();

   res.json(users);
})

/***********************s'enrégistrer *//
router.post("/register/:id/:username/:password", async (req, res) => {
  
  const {username, password} = req.body

  try{
   // Récuérer les données
      
      
      // Valider les données
      if (!(username && password)) {
          res.status(400).send("Saisissez toutes les données ouou");
          return 0
      }
      //rechercher et Vérifier si l'utilisateur existe
      const oldUser = await User.findOne({ username });

      if (oldUser) {
          return  res.send('<h1>Utilisateur existant connectez-vous</h1>');
      }
      
     //crypter le mot de passe
     encryptedPassword = await bcrypt.hash(password, 10);

     //incrémenter l'id
     const iduse = await User.countDocuments()

     let iduser= iduse+1;

     // créér un nouvelle utilisateur dans mongo
     const user = await User.create({
         iduser,
         username,
         password: encryptedPassword,
     });

     // Creer le token jxt
     const token = jwt.sign(
         { user_id: user._id,username },
         process.env.TOKEN_KEY,
         {
           expiresIn: "2h",
         }
     );
     // enregister le token de l'utilisateur
     user.token = token;

     //session
     req.session.idUser = user.id;

     // reponse et envoi du nouvel utilisateur
     res.status(201).json('<h1>Utilisateur creer,  connectez-vous</h1>');
   }
   catch (err) {
      console.log(err);
 }
});




//**************************************se connecter ****************************
//login
router.post("/login/:username/:password", async (req, res) => {
  const {username, password} = req.body;
  try {

    // Valider les données
    if (!(username && password)) {
      res.status(400).send("Saisissez toutes les données");
    }
    // vérifier si l'utilisateur existe dejas
    const user = await User.findOne({ username });
    if(user==null){
      res.status(400).send('<h1>Aucun utilisateur existant , enrégistrez vous</h1>')
      res.render('login', user)
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Creer le token
      const token = jwt.sign(
        { user_id: user._id,username  },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // enregister le token de l'utilisateur
      user.token = token;

      //session
      req.session.idUser = user.id;
      let iduser = req.session.idUser
      // reponse et envoi du nouvel utilisateur
      res.render('./pages/home', {user ,iduser})
      
    }
    else{
      res.send('<h1>mot de passe incorrect</h1>')
      return 0
    }
  } catch (err) {
    console.log(err);
  }
});



  

  module.exports = router;