'use strict';

const Configuration = require('../data/configuration'); 
const QueryManager = require('../utils/query_manager');
const url = require('url');
const sqlLiveData = require('../data/sql/liveData');

class Router {
    constructor (request, response) {
        this._request = request;
        this._mapUrl = Configuration.getMapUrl(this);
        this._queryString = url.parse(request.url, true);
        this._calledURL = new URL(Configuration.path + this._queryString.path);
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
        const mooringStates = Configuration.getMooringStates();

        let query = sqlLiveData.moored(idPortinformer, idCurrentActivity, mooringStates); 
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