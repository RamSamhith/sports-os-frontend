const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    sport:String,

    age:Number,

    academy:String

},
{
    timestamps:true
});

module.exports =
mongoose.model('Athlete', athleteSchema);