import {createBoardWebSocket} from "./board/board-web-socket.js";
import {Board} from "./board/index.js";

window.onload = function () {
	const boardWebSocket = createBoardWebSocket();

	const boardDiv = document.getElementById("lina.board");
	const board = new Board (boardWebSocket, boardDiv, 1000, 1000);
}