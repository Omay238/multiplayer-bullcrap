const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const gameState = require("./gameState");
const fs = require("fs");

let gameID = 1;

let lib = JSON.parse(fs.readFileSync(__dirname + "/libs.json").toString());
console.log(JSON.stringify(lib));

const users = new Map();

app.set('port', 0);

app.get('/', (req, res) => {
	res.mimeType = "text/html";
	res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/script.js', (req, res) => {
	res.mimeType = "text/javascript";
	res.sendFile(__dirname + '/frontend/script.js');
});

app.get('/style.css', (req, res) => {
	res.mimeType = "text/css";
	res.sendFile(__dirname + '/frontend/style.css');
});

let chosenWords = 0;

function formatTemplate(template, inputs){
	let replacing = false;
	let toReplace = "";
	let final = "";
	for(let i = 0; i < template.length; i++){
		if(template.charAt(i) === "{"){
			replacing = true;
		}else if(template.charAt(i) === "}"){
			replacing = false;
			final += inputs[inputs.map(x => x.id).indexOf(toReplace)].question;
			toReplace = "";
		}else if(replacing === false){
			final += template.charAt(i);
		}else{
			toReplace += template.charAt(i);
		}
	}
	return final;
}

io.on("connection", (socket) => {
	console.log("A user has connected.");
	let userID = users.size;

	io.on("disconnect", (_socket) => {
		console.log("A user has disconnected.");
	});

	socket.on("joined", (name) => {
		console.log("A player named " + name + " has joined.");
		gameState.players[name] = 0;
		if(chosenWords >= lib.madLibs[gameID].inputs.length) {
			let inputs = lib.madLibs[gameID].inputs;
			let template = lib.madLibs[gameID].text;
			let out = formatTemplate(template, inputs);
			io.emit("end", out);
		}else{
			let word = lib.madLibs[gameID].inputs[chosenWords];
			chosenWords++;
			socket.emit("word", word.question, word.id);
		}
	});

	socket.on("wordsubmit", (inp) => {
		let word = inp[0];
		let id = inp[1];
		lib.madLibs[gameID].inputs[lib.madLibs[gameID].inputs.map(x => x.id).indexOf(id)].question = word;
		if(chosenWords >= lib.madLibs[gameID].inputs.length) {
			let inputs = lib.madLibs[gameID].inputs;
			let template = lib.madLibs[gameID].text;
			let out = formatTemplate(template, inputs);
			io.emit("wait", "");
			if(lib.madLibs[gameID].inputs[lib.madLibs[gameID].inputs.length - 1].id === id){
				io.emit("end", out);
			}
		}else {
			let word1 = lib.madLibs[gameID].inputs[chosenWords];
			chosenWords++;
			socket.emit("word", word1.question, word1.id);
		}
	})
});

server.listen(app.get('port'), () => {
	const { port } = server.address();
	console.log(`App listening at http://localhost:${port}`);
});