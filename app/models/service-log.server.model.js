'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Service log Schema
 */
var ServiceLogSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Service log name',
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

mongoose.model('ServiceLog', ServiceLogSchema);