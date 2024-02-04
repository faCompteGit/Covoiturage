const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
    id :  {type :Number, required : true},
    user_id :  {type :Number, required : true},
    trajet_id :{type :String, required : true},
    date : {type :Date, required : true},
    commentaire: {type :String, required : true}
})

//création du model commentaire
const commentaire = mongoose.model('commentaire', commentaireSchema)

module.exports = commentaire;