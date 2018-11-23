'use strict';

class Configuration {
    get path () {
        return 'http://127.0.0.1:3000';
    }
    
    getMapUrl (routerObject) {
        let mapUrl = {
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
        return mapUrl;
    }
}


module.exports = Configuration;