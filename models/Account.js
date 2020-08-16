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
    country: {
        type: String,
    },
    region: {
        type: String,
    },
    city: {
        type: String,
    },
    images:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `Image`
        }   
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],
    matches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]

});

const Account = new mongoose.model('Account', accountSchema);

module.exports = Account;