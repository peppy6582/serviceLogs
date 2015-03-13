'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ServiceLog = mongoose.model('ServiceLog'),
	_ = require('lodash');

/**
 * Create a Service log
 */
exports.create = function(req, res) {
	var serviceLog = new ServiceLog(req.body);
	serviceLog.user = req.user;

	serviceLog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceLog);
		}
	});
};

/**
 * Show the current Service log
 */
exports.read = function(req, res) {
	res.jsonp(req.serviceLog);
};

/**
 * Update a Service log
 */
exports.update = function(req, res) {
	var serviceLog = req.serviceLog ;

	serviceLog = _.extend(serviceLog , req.body);

	serviceLog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceLog);
		}
	});
};

/**
 * Delete an Service log
 */
exports.delete = function(req, res) {
	var serviceLog = req.serviceLog ;

	serviceLog.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceLog);
		}
	});
};

/**
 * List of Service logs
 */
exports.list = function(req, res) { 
	ServiceLog.find().sort('-created').populate('user', 'displayName').exec(function(err, serviceLogs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceLogs);
		}
	});
};

/**
 * Service log middleware
 */
exports.serviceLogByID = function(req, res, next, id) { 
	ServiceLog.findById(id).populate('user', 'displayName').exec(function(err, serviceLog) {
		if (err) return next(err);
		if (! serviceLog) return next(new Error('Failed to load Service log ' + id));
		req.serviceLog = serviceLog ;
		next();
	});
};

/**
 * Service log authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.serviceLog.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
