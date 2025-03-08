const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: Number, required: true },
  filePath: { type: String, required: true },
  coverImage: { type: String },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
