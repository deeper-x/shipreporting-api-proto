'use strict';

const Configuration = require('../data/configuration'); 
const QueryManager = require('../utils/query_manager');
const url = require('url');

class Router {
    constructor (request, response) {
        this._request = request;
        this._configuration = new Configuration();
        
        this._mapUrl = this._configuration.getMapUrl(this);
        this._queryString = url.parse(request.url, true);
        this._calledURL = new URL(this._configuration.path + this._queryString.path);
    }

    getCallback () {
        return this._calledURL.pathname;
    }

    dispatch (inputPathName) {
        if ( this._mapUrl.hasOwnProperty(inputPathName) ) {
            return this._mapUrl[inputPathName];
        } else {
            return this.routeNotFound;
        }
    }
        
    mooredNow (response, params) {
        const idPortinformer = params.fk_portinformer;
        const idCurrentActivity = params.fk_ship_current_activity;

        let query = `select * from control_unit_data where fk_portinformer = ${idPortinformer} and fk_ship_current_activity = ${idCurrentActivity} and is_active = true`;
        QueryManager.sendSelect(query, response);
    }

    favicon (response) {
        response.statusCode = 200;
        response.end();
    }

    routeNotFound () {
        console.log('error: not found!');
    }
}


module.exports = Router;