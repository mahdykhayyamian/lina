import {Widget} from "./layout/widget/widget.js";

window.onload = function () {
	const appDiv = document.getElementById("lina.app");
	const widget = new Widget('myWidget', 0, 0, 500, 500);
	appDiv.appendChild(widget.node);
}