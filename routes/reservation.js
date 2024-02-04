const express = require('express');
const router = express.Router();
const Reservation =require('../models/reservations');
const Trajet =require('../models/trajets');
const Commentaire =require('../models/commentaires');
const User =require('../models/users');




//voir les réservations
router.get('/reservations', async (req,res) =>{

    const reservations = await Reservation.find();

    const commentaires = await Commentaire.find()
    const users = await User.find()

    res.render('reservation', {reservations, commentaires, users})
  
  
  });

  //réserver reservation
router.post('/reserver/:trajet_id/:nbplace', async (req,res) => {
 

  const {nbplace} = req.body;
  const {trajet_id} = req.params;
  

//vérifier si le trajet existe
const trajet = await Trajet.findOne({id:trajet_id});
if(trajet){
  //récupération du nombre de place max
  let place_max = trajet.place;
  //vérifier si la réservation existe dejas
  const reservation = await Reservation.findOne({trajet_id : trajet_id} )
  if(reservation){

    place_max_rese = reservation.place_max
   if(place_max_rese==0){
    const traj = await Trajet.updateOne({id:trajet_id}, { $set:  { etat: true }})
    res.send("'<h1>trajet plein</h1>'")
  }
   else if(nbplace>place_max_rese){
    res.send("'<h1>plus assez de place disponible</h1>'")
  }
  else{
      let newplace = place_max_rese - nbplace;
      
      const rese = await Reservation.updateOne({ trajet_id: trajet_id }, { $set:  { place_max: newplace }})
      
      res.status(400).send("réservation enrégister");
  }
  }
  }
    
});


//réserver trajet
router.post('/reservertra/:trajet_id/:nbplace/:place_max', async (req,res) => {

  const {nbplace} = req.body;
  const {trajet_id,place_max} = req.params;
  // Valider les données
  if (!( trajet_id && nbplace)) {
      res.status(400).send("Saisissez toutes les données");
      return 0
  }
  
    //vérifier si la réservation existe dejas
    const reservation = await Reservation.findOne({trajet_id : trajet_id} )
    if(reservation==null){
      if(nbplace > place_max){
        res.send("'<h1>pas assez de place disponible</h1>'")
      }
      else{
        const res = await Reservation.countDocuments()
        let pla = place_max - nbplace;

        const reserv =  Reservation.create({
          id : res+1,
          trajet_id : trajet_id,
          user_id: req.session.idUser,
          nbplace: nbplace,
          date: new Date(), 
          place_max: pla
          });

          if(pla==0){
            let rese = await Reservation.updateOne({ trajet_id: reserv.trajet_id }, { $set:  { etat: true }})
          }

          return 0
      }
      
    }
    if(reservation){

        place_max_rese = reservation.place_max
     if(place_max_rese==0){
      const traj = await Trajet.updateOne({id:trajet_id}, { $set:  { etat: true}})
      res.send("'<h1>trajet plein</h1>'")
    }
     else if(nbplace>place_max_rese){
      res.send("'<h1>plus assez de place disponible</h1>'")
    }
    else{
        let newplace = place_max_rese - nbplace;
        
        const rese = await Reservation.updateOne({ trajet_id: trajet_id }, { $set:  { place_max: newplace }})
        
        res.status(400).end("réservation enrégister");
    }
  
    }
    
});

// supprimer reservation
router.post('/supprimer/:reserv_id', async (req, res) => {
  try {
    await Reservation.deleteOne({id:req.params.reserv_id});
    res.status(400).send("réservation supprimer");
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur du serveur');
  }
});



  module.exports = router;
