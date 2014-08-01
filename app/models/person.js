var mongoose = require('mongoose');

module.exports = mongoose.model('Person', {
	text : {type : String, default: ''},
	pool : {type : Number, default: 1}
});