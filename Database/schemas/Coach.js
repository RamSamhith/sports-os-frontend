const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({

   name:String,

   sport:String,

   certification:String,

   level:String,

   experienceYears:Number,

   academyId:String,

   rating:{
      type:Number,
      min:0,
      max:5,
      default:0
   },

   reviewCount:{
      type:Number,
      default:0
   }

},
{
   timestamps:true
});

module.exports =
mongoose.model('Coach', coachSchema);