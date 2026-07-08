require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const Sport = require('./schemas/Sport');

mongoose.connect(process.env.MONGO_URI);

const results = [];

fs.createReadStream('sports.csv')
.pipe(csv())
.on('data', (data) => {

    results.push({

        sportName: data['sportName'],

        category: data['category'],

        description: data['description'],

        benefits: data['benefits'].split('|'),

        teamSize: data['teamSize'],

        equipment: data['equipment'].split('|'),

        duration: data['duration'],

        tournamentLevels: data['tournamentLevels'].split('|'),

        governingBody: data['governingBody'],

        olympicSport: data['olympicSport'] === 'true',

        ageGroups: data['ageGroups'].split('|')

    });

})
.on('end', async () => {

    try {

       await Sport.deleteMany({});
       
       await Sport.insertMany(results);
       
       console.log("✅ Sports Imported Successfully");
       
    } catch (error) {

        console.log(error);

    } finally {

        mongoose.connection.close();

    }

});