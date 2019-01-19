import * as loadJS from "load-js"


function visualizeBoardCommands(board) {

	const {commands, rootElement} = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	console.log("in sequence diagram visualization");

	console.log(loadJS);
	
	loadJS([{
			async: true,
			url: "/lina/webfont.js"
	  }, {
			async: true,
			url: "/lina/snap.svg-min.js"
	  }, {
			async: true,
			url: "/lina/underscore-min.js"
	  }, {
			async: true,
			url: "/lina/sequence-diagram-min.js"
	  }])
	  .then(() => {
			console.log("all required scripts loaded");

			const container = document.createElement("div");
			const uniqid = String(Date.now());
			container.id = uniqid;
			board.rootElement.appendChild(container);
			console.log(document.getElementById(uniqid));

			var d = Diagram.parse(commands);
			var options = {theme: 'simple'};

			d.drawSVG(uniqid, options);
	  });

}

const visualizer = {
	visualizeBoardCommands
};

export {visualizer};
