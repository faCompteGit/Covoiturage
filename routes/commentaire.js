const express = require('express');
const router = express.Router();
const Reservation =require('../models/reservations');
const Trajet =require('../models/trajets');
const Commentaire =require('../models/commentaires');



router.post('/commenter/:trajet_id/:commentaire', async (req,res) => {
    const {commentaire} = req.body;
    const {trajet_id} = req.params;
    // Valider les données
    if (!(trajet_id && commentaire)) {
        res.status(400).send("Saisissez toutes les données");
    
    }
  
        const idcom = await Commentaire.countDocuments();
      const newcommentaire =  Commentaire.create({
        id : idcom+1,
        user_id: req.session.idUser,
        trajet_id : trajet_id,
        date: new Date(), 
        commentaire: commentaire
        });
  
        res.status(400).send("commentaire ajouté")
  
    });

    module.exports= router