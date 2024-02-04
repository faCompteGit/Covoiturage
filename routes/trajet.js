const express = require('express');
const router = express.Router();
const Trajet =require('../models/trajets');




//***************voir Tous les trajets**************************
router.get('/trajets', async (req,res) => {
  console.log(req.session)
    const trajets = await Trajet.find();
    res.render('trajet', {trajets})
    
});


//***************voir Tous les trajets d'un utilisateur**************************
router.get('/trajetUser', async (req,res) => {
  const trajets = await Trajet.find({user_id: req.session.idUser});
  res.render('trajet', {trajets})
  
});


//******************************************************************************************************************
//Rechercher un trajet 
router.get('/trajetFind/:depart/:destination/:date', async (req,res) => {
    
    const {depart, destination, date}= req.query
    
    console.log(destination)
    console.log(date)
    //voir si le trajet existe dans la base
    const traj_existant = await Trajet.find({$and:[{depart:depart} , {destination:destination}]})
    if(traj_existant.length==0){
      
      res.send("'<h1>pas de trajet pour ce point de depart et cette destination </h1>'")
      return 0
    }
    if(traj_existant){
      const trajet_heur_exist = await Trajet.find( {$and:[{depart:depart},{destination:destination},{date: {
        $lte: `${date}`
      }}]})

      if(trajet_heur_exist.length==0){
        res.send("'<h1>Pas de trajets pour cette heure</h1>'")
        return 0
      }
      else{
        let trajets = trajet_heur_exist
        res.render('trajet', {trajets})
        return 0
      }
    }


});


router.get('/trajetFind', async (req,res) => {
    
  const depart =  req.body.depart
  const destination =  req.body.destination;
  //voir si le trajet existe dans la base
  const trajet = await Trajet.find({$and:[{depart:depart} , {destination:destination}]})
  if(trajet.length==0){
    res.send("'<h1>pas de trajet pour ce point de depart et cette destination </h1>'")
    return 0
  }
  else{
      
      res.render('trajet', {trajets})
  }
  


});


//creer un trajet 
router.post('/addtrajets', async (req,res) => {

  const {depart, destination, date, place} = req.body;
  console.log(req.body.place);
  console.log(typeof(req.body.place));
  

  // Valider les données
  if (!(depart && destination  && date && place)) {
      res.status(400).send("Saisissez toutes les données");
  }
  else{
    let id_trajet = await Trajet.countDocuments();
    console.log(id_trajet)
    const trajet =  Trajet.create({
      id : id_trajet+1,
      user_id : req.session.idUser,
      depart: req.body.depart,
      destination: req.body.destination,
      date: new Date(req.body.date), 
      place: req.body.place
      });
      res.send("'<h1>trajet ajouté</h1>'")

  }
});


// supprimer trajet
router.post('/supprimer/:traj_id', async (req, res) => {
  try {
    await Trajet.deleteOne({id:req.params.traj_id});
    res.status(400).send("trajet supprimer");
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur du serveur');
  }
});


module.exports = router;
