const mongoose = require('mongoose');
const Organization = require('../organization/Organization');
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Organization
    }
}, { timestamps: true });
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');