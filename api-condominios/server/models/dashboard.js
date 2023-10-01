'use strict';

var _ = require('lodash')
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment')

module.exports = function(Dashboard) {

	const get_data = ({data, columns, name}) => {

		return new Promise(resolve => {

		})
	}

  	Dashboard.get = get_data

  	Dashboard.generar = async function(condominium){
		return url
  	}

  Dashboard.remoteMethod('get', {
  	accepts: [{
        arg: 'condominium',
        type: 'string'
    }],
    returns: {arg: 'result', type: 'array'}
  });

};
