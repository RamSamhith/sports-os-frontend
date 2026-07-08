\# Database Layer



\## Overview



This module implements the Database Layer for the Sports Operating System (Sports OS) project. It is responsible for storing and managing application data using MongoDB Atlas and Mongoose. The database layer provides schemas, database connectivity, and bulk data import scripts for the backend.



\---



\## Technologies Used



\- Node.js

\- Express.js

\- MongoDB Atlas

\- Mongoose

\- CSV Parser

\- Dotenv



\---



\## Folder Structure



```

Database-Layer

│

├── config

│   └── db.js

│

├── schemas

│   ├── Academy.js

│   ├── Athlete.js

│   ├── Coach.js

│   ├── Sport.js

│   └── Shortlist.js

│

├── importAcademies.js

├── importCoaches.js

├── importSports.js

├── importAthletes.js

│

├── academies.csv

├── sports.csv

├── athletes.csv

│

├── server.js

├── package.json

└── README.md

```



\---



\## Database Collections



The following MongoDB collections are used:



\- Academies

\- Coaches

\- Sports

\- Athletes

\- Shortlists



\---



\## Features Implemented



\- MongoDB Atlas database connection

\- Mongoose schema definitions

\- Database models for all required collections

\- CSV-based bulk data import

\- CRUD-ready database structure

\- Environment variable configuration using Dotenv



\---



\## Files Added / Modified



\### Configuration



\- config/db.js



\### schemas



\- schemas/Academy.js

\- schemas/Coach.js

\- schemas/Sport.js

\- schemas/Athlete.js

\- schemas/Shortlist.js



\### Import Scripts



\- importAcademies.js

\- importCoaches.js

\- importSports.js

\- importAthletes.js



\### Data Files



\- academies.csv

\- sports.csv

\- athletes.csv



\---



\## Setup Instructions



\### 1. Install Dependencies



```bash

npm install

```



\### 2. Create Environment File



Create a `.env` file in the project root.



```env

MONGO\_URI=<Your MongoDB Atlas Connection String>

PORT=8095

```



> Do not commit the `.env` file to GitHub.



\### 3. Import Data



Import Academy data:



```bash

node importAcademies.js

```



Import Coach data:



```bash

node importCoaches.js

```



Import Sports data:



```bash

node importSports.js

```



Import Athlete data (if applicable):



```bash

node importAthletes.js

```



\### 4. Start the Server



```bash

node server.js

```



\---



\## Database Verification



Connect to MongoDB Atlas using `mongosh` and verify the imported data:



```javascript

use sportsOS



db.academies.countDocuments()



db.coaches.countDocuments()



db.sports.countDocuments()

```



Example output:



```

Academies : 1155

Coaches   : 1155

Sports    : 20

