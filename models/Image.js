const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    downloadUrl: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    }
});

const Image = new mongoose.model('Image', imageSchema);

module.exports = Image;