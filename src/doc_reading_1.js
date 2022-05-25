const os = require("os");
const fs = require("fs");
const path = require("path");
const http = require("http");
const net = require('net');
const { URL } = require("url");

// ----

// HTTP message example:
// {
//     'content-length': '123',
//     'content-type': 'text/plain',
//     'connection': 'keep-alive',
//     'host': 'example.com',
//     'accept': '*/*'
// }

// (!) keys are lower-cased =< is this portable ?

// HTTP API is "low level"; it merely parses "HTTP messages"
// into <headers, body>, but not also interpret the
// information in them

// (*): handling duplicate handlers when parsing => (?)

// ".rawHeaders" as they were received -> an array

// sample:
// [ 'ConTent-Length', '123456',
//     'content-LENGTH', '123',
//     'content-type', 'text/plain',
//     'CONNECTION', 'keep-alive',
//     'Host', 'example.com',
//     'accepT', '*/*'
// ]
// this has duplicates, "variants in upper-lower case"

// ----

// an HTTP Agent -> there is connection and client; the client can be reused for
// multiple connections; an agent/client can be persisted

// "Agent manages connection persistence"
// maintains a queue of requests for <host, port>
// reuses a single socket for the communication - until the queue is empty (!)
// there is a socket pool afterwards, and the allocation-deallocation is dynamic (!)
// keepAlive option decides whether to destroy or pool the Agent object / socket (?)

// TCP Keep-Alive (!)

// a server can accept or reject "multiple requests on the same connection"
// if rejected, then the Agent has to make a connection for each request

// destroy Agent whenever it's not used anymore

// When intending to keep one HTTP request open for a long time without
// keeping it in the agent, something like the following may be done:
// http.get(options, (res) => {
//     // Do stuff
// }).on('socket', (socket) => {
//     socket.emit('agentRemove');
// });
// => .on('agent', (agent) => {} )
// => .on('socket', (socket) => {} )

// An agent may also be used for an individual request. By providing
// {agent: false} as an option to the http.get() or http.request()
// functions, a one-time use Agent with default options will be used
// for the client connection.
// http.get({
//     hostname: 'localhost',
//     port: 80,
//     path: '/',
//     agent: false  // Create a new agent just for this one request
// }, (res) => {
//     // Do stuff with response
// });

// ----

const server = http.createServer( (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
    socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
        'Upgrade: WebSocket\r\n' +
        'Connection: Upgrade\r\n' +
        '\r\n');
    socket.pipe(socket);    // echo back
});

server.listen(1337, '127.0.0.1', () => {
    const options = {
        port: 1337,
        host: '127.0.0.1',
        headers: {
            'Connection': 'Upgrade',
            'Upgrade': 'websocket'
        }
    };

    const req = http.request(options);
    req.end();  // ?
    req.on('upgrade', (res, socket, upgradeHead) => {
        console.log("got upgrade");
        socket.end();
        process.exit(0);    // node.js terminate ?
    });
})

// ----

const options_2 = {
    host: '127.0.0.1',
    port: 8080,
    path: '/length_request'
};

const req = http.request(options_2);
req.end();
req.on('information', (info) => {
    console.log(`Got info: ${info.statusCode}`);
});

// ----

const port_3 = 1400;
// HTTP tunneling proxy (!)
const proxy = http.createServer( (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
    const { port, hostname } = new URL(`http://${req.url}`);
    const serverSocket = net.connect(port || 80, hostname, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
            'Proxy-agent: Node.js-Proxy\r\n' +
            '\r\n');
        serverSocket.write(head);
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });
});

proxy.listen(port_3, '127.0.0.1', () => {
    const options = {
        port: port_3,
        host: '127.0.0.1',
        method: 'CONNECT',
        path: 'www.google.com:80'
    };

    const req = http.request(options);
    req.end();

    req.on('connect', (req, socket, head) => {
        console.log('got connected');

        socket.write('GET / HTTP1.1 \r\n' +
            'Host: www.google.com:80\r\n' +
            'Connection: close\r\n' +
            '\r\n');
        socket.on('data', (chunk) => {
            console.log(chunk.toString());
        });
        socket.on('end', () => {
            proxy.close();
        });
    });
});

// ----