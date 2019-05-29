<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<link rel="stylesheet" href="/whiteboard/app.css">
	<script src="/whiteboard.js" type="text/javascript"></script>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Lina Whiteboard</title>
</head>

<body>
	<div class="account-info">
		Welcome <%= request.getAttribute("user-name") %>!  <a href="/whiteboard/logout">Logout</a>
	</div>
	<div id="lina.app"></div>
</body>
</html>
