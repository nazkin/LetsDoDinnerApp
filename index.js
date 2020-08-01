const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const dotenv = require('dotenv');
const PORT = 8080;
dotenv.config();
const authRoute = require('./routes/auth');

const app = express();



mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    ()=> console.log('DB connected')
);

//middlewares
app.use(cors());
app.use(express.json());

//This is for validation when logging in a new user and other validations of POST bodies

app.use('/api/user', authRoute);



app.listen(PORT, ()=> {
    console.log('Dating app server listening on port '+PORT);
});