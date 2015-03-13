'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Equipment Schema
 */
var EquipmentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Equipment name',
		trim: true
	},
	department: {
		type: String,
		default: '',
		required: 'Please fill Equipment department',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Equipment description',
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

mongoose.model('Equipment', EquipmentSchema);
