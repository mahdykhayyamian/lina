<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<link rel="stylesheet" href="/paragraph/authentication/login.css">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Login</title>
	</head>

	<body class="login">
		<div>
			<form action='<%= request.getAttribute("action") %>' method="post">
				<div>
					<input type="text" name="userName" placeholder="Pick a name">
				</div>
				<button id="go-button" class="go-button" type="input">Go!</button>
			</form>
		</div>
	</body>
</html>
