const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sentBy: {
        type: String
    },
    receivedBy: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat' 
    }
});

const Message = new mongoose.model('Message', messageSchema);

module.exports = Message;