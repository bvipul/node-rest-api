const mongoose = require('mongoose');
const OrganizationSchema = new mongoose.Schema({
    name: String
}, { timestamps: true });
mongoose.model('Organization', OrganizationSchema);
module.exports = mongoose.model('Organization');