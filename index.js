const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 8080;
dotenv.config();


// mongoose.connect(process.env.DB_CONNECTION,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     ()=> console.log('DB connected')
// );
mongoose.connect('mongodb://localhost:27017/dinnerDates', {useNewUrlParser: true, useUnifiedTopology: true });
const app = express();

//middlewares***************************************
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//*************************************************

//Routes from express router files
const authRoute = require('./routes/auth');
const accountRoute = require('./routes/account');
app.use('/api/user', authRoute);
app.use('/api/account', accountRoute);


app.listen(PORT, ()=> {
    console.log('Dating app server listening on port ' + PORT);
});