var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	alamat: {
		type: String,
		required: true
	},
	noTelp: {
		type: String,
		required: true
	},
	role: {
		type: Number,
		default: 0,
	},
},
{
	timestamps: true
})

var user = module.exports = mongoose.model('users', userSchema) 