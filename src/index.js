const os = require("os");
const fs = require("fs");
const path = require("path");
const http = require("http");

const config = require("../../config.json");

// console.log(os);
// console.log( os.version() );
// console.log( os.userInfo() );
// console.log ( os.type() );
// console.log ( os.totalmem() );
// console.log ( os.tmpdir() );
// console.log ( os.release() );
// console.log ( os.platform() );
// console.log ( os.networkInterfaces() );
// console.log ( os.loadavg() );
// console.log ( os.hostname() );
// console.log ( os.homedir() );
// console.log ( os.freemem() );
// console.log ( os.endianness() );
// console.log ( os.cpus() );
// console.log ( os.arch() );
// console.log( os.uptime() );

// ----

// console.log(path);

const { readFileSync, writeFileSync } = require('fs');
const read_0 = readFileSync("./data/numeric", "utf8");  // <OBSERVATION> this is relative to the project's root directory (!), not to the current index.js file
console.log(read_0);

// ----

// res.write vs res.writeHead -> which is body, which is headers ?
// res.write() -> what is a "chunk" ? what about a blob ? is it just a generic payload ?
const server = http.createServer( (req, res) => {
    // console.log( "URL: ", req.url );
    // console.log( "Status messasge: ", req.statusMessage );
    // console.log( "HTTP version: ", req.httpVersion );
//    // console.log( "socket: ", req.socket );
    // console.log( "raw Trailers: ", req.rawTrailers );
    // console.log( "raw Headers: ", req.rawHeaders );
    // console.log( "Headers: ", req.headers );

    if (req.url === '/') {
        res.end("Home page");
    }
    else if (req.url === '/error') {
        res.end('<h1>Error, go back</h1><a href="/">nav home</a>');
    }
    else {
        res.end("Unknown page");
    }
}); // <OBSERVATION>: if the message contains even one element that is not inside tags (so even a single "non-HTML element", then the whole
    // content seems to not be parsed as HTML (!)

console.log(config);
server.listen(config["server-rsbi"]["port"]);

// ----

// safe-parse URL; escape %xx sequences
// extract parameters from URL (GET ?)
// normalize, handle duplicates and parse header parameters
// print the body
// (?): does the request not have a body ? only the response has a body ?

// ----
