const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({

    sportName:{
        type:String,
        required:true
    },

    category:String,

    description:String,

    benefits:[String],

    teamSize:String,

    equipment:[String],

    duration:String,

    tournamentLevels:[String],

    governingBody:String,

    olympicSport:Boolean,

    ageGroups:[String]

},
{
    timestamps:true
});

module.exports =
mongoose.model('Sport', sportSchema);