'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Department Schema
 */
var DepartmentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Department name',
		trim: true
	},
	contact: {
		type: String,
		default: '',
		required: 'Please fill Department contact name',
		trim: true
	},
	email: {
		type: String,
		default: '',
		required: 'Please fill Department email',
		trim: true
	},
	address: {
		type: String,
		default: '',
		required: 'Please fill Department address',
		trim: true
	},
	city: {
		type: String,
		default: '',
		required: 'Please fill Department city',
		trim: true
	},
	state: {
		type: String,
		default: '',
		required: 'Please fill Department state',
		trim: true
	},
	postalCode: {
		type: String,
		default: '',
		required: 'Please fill Department postal code',
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

mongoose.model('Department', DepartmentSchema);
