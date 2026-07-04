require('dotenv').config();

const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const Academy = require('./schemas/Academy');

async function importAcademies() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to MongoDB");

        const results = [];

        fs.createReadStream('academies.csv')
        .pipe(csv())

        .on('data',(data)=>{

            results.push({

                academyId:data['Academy ID'],

                name:data['Academy Name'],

                slug:data['Slug'],

                latitude:Number(data['Latitude']),

                longitude:Number(data['Longitude']),

                description:data['Description'],

                sport:data['Sport'],

                address:data['Address'],

                city:data['City'],

                state:data['State'],

                contactNumber:data['Contact Number'],

                googleMapsLink:data['Google Maps Link'],

                academyImage:data['Academy Image'],

                fees:data['Fees'],

                facilities:data['Facilities'],

                batchTimings:data['Batch Timings'],

                ageGroups:data['Age Groups'],

                gender:data['Gender'],

                batchCapacity:Number(data['Batch Capacity']),

                verified:data['Verified'] === 'true',

                socialLinks:data['Social Links'],

                rating:Number(data['Rating']) || 0,

                reviewCount:Number(data['Reviews']) || 0,

                savedCount:0

            });

        })

        .on('end',async()=>{

            try{

                console.log("Academies Found :",results.length);

                await Academy.deleteMany({});

                await Academy.insertMany(results);

                console.log("✅ Academies Imported Successfully");

            }

            catch(err){

                console.error(err);

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

importAcademies();