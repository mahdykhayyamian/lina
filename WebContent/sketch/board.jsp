<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<script src="sketch/sketchBoardWebSocketClient.js" type="text/javascript"></script>
	<script src="sketch/canvas.js" type="text/javascript"></script>
	<script src="sketch/initializeBoard.js" type="text/javascript"></script>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Canvas</title>
</head>
<body onload="initializeBoard();">
	<div id="messageBoard"></div>

	<div id="canvas">Click to drawp<br/></div>
</body>
</html>