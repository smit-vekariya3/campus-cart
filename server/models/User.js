const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  collegeEmail: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  savedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
});
module.exports = mongoose.model('User', UserSchema);