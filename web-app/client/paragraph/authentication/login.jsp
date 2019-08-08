<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<link rel="stylesheet" href="/paragraph/authentication/login.css">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

		<!-- Google Sign-in --->
		<script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
		<meta name="google-signin-client_id" content="737742406146-ctvhpef0pmjin27075a9vhsfb0pre821.apps.googleusercontent.com">
		<script src="/paragraph/authentication/google-sign-in.js"></script>

		<title>Login</title>
	</head>

	<body class="login">
		<div>
			<form id="login-form" action='<%= request.getAttribute("action") %>' method="post">
				<div class="hidden">
					<input id="user-name" type="text" name="userName">
					<input id="google-auth-token" type="text" name="googleAuthToken">
				</div>
				<div id="my-signin2"></div>
			</form>
		</div>
	</body>
</html>
