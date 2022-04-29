//FUNCTIONS//

function coinFlip() {
    return Math.floor(Math.random()*2) ? 'heads' : 'tails';
}

function coinFlips(flips) {
    var arr = []
    for (let i = 0; i<flips; i++){
      arr[i] = coinFlip(); 
    }
    return arr;
}

function countFlips(array) {
    const counter = {
      heads: 0,
      tails: 0,
    }
    array.forEach(element => {
      (element=='heads') ? counter.heads += 1 : counter.tails += 1;
    });
    if(counter.heads == 0){
      return {tails: counter.tails};
    }
    if(counter.tails == 0){
      return {heads: counter.heads};
    }
    return counter
}

function flipACoin(call) {
    const object = {
      call: '',
      flip: '',
      result: '',
    }
    object.call = call;
    object.flip = coinFlip();
    (object.flip == object.call) ? object.result = 'win' : object.result = 'lose';
    return object;
}

//SERVER//

// Require Express.js
const express = require('express')
const app = express()

//import minimist
const minimist = require('minimist')
const args = minimist(process.argv.slice(2));

var HTTP_PORT = args['port'] || 5000

// Start an app server
const server = app.listen(HTTP_PORT, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',HTTP_PORT))
});

// Setting Endpoint
app.get('/app/', (req, res) => {
// Respond with status 200
    res.statusCode = 200;
// Respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode+ ' ' +res.statusMessage)
});

app.get('/app/flip/', (req, res) => {
    res.status(200).type('text/json');
	res.json({flip: coinFlip()})
});

app.get('/app/flips/:number', (req, res) => {
    res.status(200).type('text/json');
    var x = coinFlips(isFinite(req.params.number)?req.params.number:1);
    const flips = {
        raw: x,
        summary: countFlips(x),
    }
	res.json(flips)
});

app.get('/app/flip/call/:guess(heads|tails)', (req, res) => {
    res.status(200).type('text/json');
	res.json(flipACoin(req.params.guess))
});

// Default response for any other request
app.use(function(req, res){
    res.status(404).type("text/plain")
    res.send('404 NOT FOUND')    
});