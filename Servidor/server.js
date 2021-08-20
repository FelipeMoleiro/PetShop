//Felipe Guilermmo Santuche Moleiro - 10724010


const http = require('http');
const debug = require('debug')('nodestr:server');
const app = require('./app');

const port = 3000;
app.set('port',port);

const server = http.createServer(app);

server.listen(port);
console.log("API RODANDO NA PORTA " + port);
