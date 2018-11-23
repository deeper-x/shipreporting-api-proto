let http = require('http');
let Router = require('./utils/router');
let url = require('url');

const server = http.createServer((req, res) => {
    let router = new Router(req, res);
    let toBeCall = router.getCallback(req);
    let callback = router.dispatch(toBeCall);
    let queryString = url.parse(req.url, true);
    let calledURL = new URL('http://127.0.0.1:3000' + queryString.path);

    let searchParams = calledURL.searchParams;
    
    let SQLparams = {
        'fk_portinformer': searchParams.get('id_portinformer'),
        'fk_ship_current_activity': searchParams.get('id_activity')
    };
    
    callback.methodToCall(res, SQLparams);
});


let port = 3000;
let hostname = 'localhost';

server.listen(port, hostname, () => {
    console.log(`running on ${hostname}:${port}...`);
});