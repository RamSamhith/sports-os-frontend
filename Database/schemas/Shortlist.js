const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({

  athleteId:Number,

  academyId:Number,

  academyName:String,

  sport:String,

  note:String

},
{
   timestamps:true
});

module.exports =
mongoose.model('Shortlist', shortlistSchema);