'use strict';

class Configuration {
    constructor () {
        this._host = '127.0.0.1';
        this._port = 3001;
        this._mooringStates = '(17, 18, 19, 20, 21, 22)';
    }
    
    get path () {
        return `http://${this._host}:${this._port}`;
    }
    
    get host () {
        return this._host;
    }

    get port () {
        return this._port;
    }

    get mooringStates () {
        return this._mooringStates;
    }
    
    getMappedUrl (routerObject) {
        return {
            '/mooredNow': {
                'methodToCall': routerObject.mooredNow,
                'params': [
                    'fk_portinformer', 'fk_ship_current_activity'
                ]
            },
            '/favicon.ico': {
                'methodToCall': routerObject.favicon
            }
        };
    }
}


module.exports = Configuration;