const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', UserSchema);