
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    userOne: {
        type: String
    },
    userTwo: {
        type:String
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `Message`
        }   
    ]


})

const Chat = new mongoose.model('Chat', chatSchema);

module.exports = Chat;