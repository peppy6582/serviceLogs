'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ServiceCompany = mongoose.model('ServiceCompany'),
	_ = require('lodash');

/**
 * Create a Service company
 */
exports.create = function(req, res) {
	var serviceCompany = new ServiceCompany(req.body);
	serviceCompany.user = req.user;

	serviceCompany.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceCompany);
		}
	});
};

/**
 * Show the current Service company
 */
exports.read = function(req, res) {
	res.jsonp(req.serviceCompany);
};

/**
 * Update a Service company
 */
exports.update = function(req, res) {
	var serviceCompany = req.serviceCompany ;

	serviceCompany = _.extend(serviceCompany , req.body);

	serviceCompany.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceCompany);
		}
	});
};

/**
 * Delete an Service company
 */
exports.delete = function(req, res) {
	var serviceCompany = req.serviceCompany ;

	serviceCompany.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceCompany);
		}
	});
};

/**
 * List of Service companies
 */
exports.list = function(req, res) { 
	ServiceCompany.find().sort('-created').populate('user', 'displayName').exec(function(err, serviceCompanies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(serviceCompanies);
		}
	});
};

/**
 * Service company middleware
 */
exports.serviceCompanyByID = function(req, res, next, id) { 
	ServiceCompany.findById(id).populate('user', 'displayName').exec(function(err, serviceCompany) {
		if (err) return next(err);
		if (! serviceCompany) return next(new Error('Failed to load Service company ' + id));
		req.serviceCompany = serviceCompany ;
		next();
	});
};

/**
 * Service company authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.serviceCompany.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
