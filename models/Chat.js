
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `Message`
        }   
    ]


})

const Chat = new mongoose.model('Chat', chatSchema);

module.exports = Chat;