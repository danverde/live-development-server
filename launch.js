var fs = require("fs");
var https = require("https");
var url = require("url");
var port = getPort();


function getPort() {
    if (process.argv[2] == undefined)
        return 8000;
    else
        return process.argv[2];
}

function getScript(port) {
    var url = 'https://localhost:' + port + '/fileDirectory';
    return "<script scr=" + url + "></script>";
}

function processRequest(req, res) {
    var request = url.parse(req.url).pathname;
    var reader = fs.createReadStream("." + request);
    reader.pipe(res);
    console.log(request);
    reader.on("error", function () {
        res.writeHead(404);
        res.write("404:\nThe page you are looking for does not exist...\nSO GET LOST!\neven though you already are...");
        res.end();
    });
}

var options = {
    key: fs.readFileSync(__dirname + "/keys/server.key"), // __dirname to find directory
    cert: fs.readFileSync(__dirname + "/keys/server.crt")
}

function main() {
    https.createServer(options, processRequest).listen(port) // port dynamic
    console.log("Server is active on port " + port);
    console.log(getScript(port)); // also diaplay the script tag with data...
}
exports.server = main();
