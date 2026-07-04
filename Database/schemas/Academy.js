const mongoose = require('mongoose');

const academySchema = new mongoose.Schema({

   academyId:String,

   name:String,

   slug:String,

   latitude:Number,

   longitude:Number,

   description:String,

   sport:String,

   address:String,

   city:String,

   state:String,

   contactNumber:String,

   googleMapsLink:String,

   academyImage:String,

   fees:String,

   facilities:String,

   batchTimings:String,

   ageGroups:String,

   gender:String,

   batchCapacity:Number,

   verified:Boolean,

   socialLinks:String,

   rating:{
      type:Number,
      min:0,
      max:5,
      default:0
   },

   reviewCount:{
      type:Number,
      default:0
   },

   savedCount:{
      type:Number,
      default:0
   }

},
{
   timestamps:true
});

module.exports =
mongoose.model('Academy', academySchema);