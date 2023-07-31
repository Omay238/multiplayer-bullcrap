const main = require("./index")

function loopMain(){
	main();
	setTimeout(loopMain, 1000);
}

loopMain();