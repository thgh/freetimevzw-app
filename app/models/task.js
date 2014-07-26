var mongoose = require('mongoose');

module.exports = mongoose.model('Task', {
  text: {
    type: String,
    default: 'Ochtendtaak'
  },
  text2: {
    type: String,
    default: null
  },
  short: {
    type: Number,
    default: 1
  },
  long: {
    type: Number,
    default: 1
  }
});
