var mongoose = require('mongoose');

module.exports = mongoose.model('Task', {
	text : {type : String, default: ''}
});