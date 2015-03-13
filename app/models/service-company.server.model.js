'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Service company Schema
 */
var ServiceCompanySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Service company name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ServiceCompany', ServiceCompanySchema);