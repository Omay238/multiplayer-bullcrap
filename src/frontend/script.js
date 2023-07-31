let socket = io();

alert("If you're new, go to the terminal by pressing command + tab, exit the nodejs program, and type 'npm run test' It's multiplayer, so it's a bit worse now.")

document.querySelector("#joinbutton").onclick = () => {
	socket.emit("joined", document.querySelector("#name").value);
	document.querySelector("#join").remove();
	//loop();
}

socket.on("word", (word, id) => {
	document.querySelector("#word").value = "";
	document.querySelector("#prompt").innerText = word;
	document.querySelector("#prompt").classList.remove(document.querySelector("#prompt").classList.item(0))
	document.querySelector("#prompt").classList.add(id);
	document.querySelector("#game").style.display = "block";
});

document.querySelector("#submit").onclick = () => {
	socket.emit("wordsubmit", [document.querySelector("#word").value, document.querySelector("#prompt").classList.item(0)]);
}

socket.on("end", (message) => {
	document.querySelector("#end").innerHTML = message + "<br>Press Ctrl+R or Cmd+R to play again.";
});

socket.on("wait", () => {
	document.querySelector("#game").remove();
	document.querySelector("#end").innerHTML = "Just wait. The last person is submitting their answers now!";
});

// function setup() {
// 	createCanvas(400, 400);
// 	background(255);
// 	strokeWeight(10);
// 	noLoop();
// }
//
// function draw() {
// 	if(mouseIsPressed){
// 		line(mouseX, mouseY, pmouseX, pmouseY);
// 	}
// 	if(keyIsPressed){
// 		socket.emit("imagedone", readPixels());
// 	}
// }