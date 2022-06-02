const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
const usersRoute = require('./routes/users');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', usersRoute);


mongoose.connect(process.env.DB_URI, () => 
    console.log('Connected to DB')
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));