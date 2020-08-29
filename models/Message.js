const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sentBy: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    body:{
        type: String
    },
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat' 
    }
});

const Message = new mongoose.model('Message', messageSchema);

module.exports = Message;