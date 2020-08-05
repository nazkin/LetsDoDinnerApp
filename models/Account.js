const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    nickname:{
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    description: {
        type: String,
        default: "Hi there, nice to meet you"
    },
    gender:{
        type: String,
        required: true
    },
    dob:{
        type: Date,
        required: true
    },
    interestedIn:{
        type: String
    },
    matchAgeMax: {
        type: Number,
        default: 80
    },
    matchAgeMin: {
        type: Number,
        default: 18
    },
    images:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `Image`
        }   
    ]

});

const Account = new mongoose.model('Account', accountSchema);

module.exports = Account;