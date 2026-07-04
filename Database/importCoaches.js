require('dotenv').config();

const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const Coach = require('./schemas/Coach');

async function importCoaches(){

    try{

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected");

        const results=[];

        fs.createReadStream('academies.csv')

        .pipe(csv())

        .on('data',(data)=>{

            results.push({

                name:data['Coach Name'],

                sport:data['Coach Sport'],

                certification:data['Certifications'],

                experienceYears:Number(data['Coach Experience'])||0,

                academyId:data['Academy ID'],

                rating:Number(data['Rating'])||0,

                reviewCount:Number(data['Reviews'])||0

            });

        })

        .on('end',async()=>{

            try{

                console.log("Coaches Found :",results.length);

                await Coach.deleteMany({});

                await Coach.insertMany(results);

                console.log("✅ Coaches Imported");

            }

            finally{

                mongoose.connection.close();

            }

        });

    }

    catch(err){

        console.log(err);

    }

}

importCoaches();