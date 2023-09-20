const http = require('http');

let reqParams = {
    hostname: 'localhost',
    port: 8080,
    path: '/api',
    method: 'post',
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
        // or 'Content-type': 'application/x-www-form-urlencoded' for form in html
    },
};

let buffer_array = [];

let html = 'nom=josé' // x-www-form-urlencoded

let req = http.request(reqParams, (res) => {

    res.on('data', (chunk) => {
        buffer_array.push(chunk);
    });

    res.on('end', () => {
        let buffer_as_string = Buffer.concat(buffer_array).toString();
        console.log(buffer_as_string);
    });

    res.on('error', () => {

    });

});

req.write(JSON.stringify({ msg: 'something to send to the server' }));// write the body data
req.end(); // send the request