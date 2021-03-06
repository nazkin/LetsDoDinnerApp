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
    age: {
        type: Number, 
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
    avatar: {
        type: String 
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
    invitations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }
    ],
    connections:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }
    ],
});

const Account = new mongoose.model('Account', accountSchema);

module.exports = Account;