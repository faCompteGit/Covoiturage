
const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
    id :  {type :Number, required : true},
    user_id :  {type :Number, required : true},
    depart :{type :String, required : true},
    destination : {type :String, required : true},
    date : {type :Date, required : true},
    place : {type :Number, required : true},
    etat : {type :Boolean, default : false}
})

//création du model trajet
const trajet = mongoose.model('trajet', trajetSchema)

module.exports = trajet;