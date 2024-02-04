
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    id :  {type :Number, required : true},
    trajet_id :  {type :Number, required : true},
    user_id :  {type :Number, required : true},
    nbplace : {type :Number, required : true},
    date : {type :Date, required : true},
    place_max :  {type :Number, default : 0},

})

//création du model student
const reservation = mongoose.model('reservation', reservationSchema)

module.exports = reservation;