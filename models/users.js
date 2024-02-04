
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id :  {type :Number, required : true},
    username :{type :String, required : true},
    password : {type :String, required : true}
})

//création du model student
const user = mongoose.model('user', userSchema)

module.exports = user;