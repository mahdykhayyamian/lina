<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<link rel="stylesheet" href="/src/paragraph/app.css">
		<script src="/paragraph.js" type="text/javascript"></script>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Lina paragraph</title>

		<meta name="google-signin-client_id" content="737742406146-ctvhpef0pmjin27075a9vhsfb0pre821.apps.googleusercontent.com">
		<script src="/src/paragraph/authentication/google-sign-out.js"></script>
		<script src="https://apis.google.com/js/platform.js?onload=initAuth" async defer></script>
	</head>

	<body>
		<div class="account-info">
			Welcome <%= request.getAttribute("given-name") %>!  	<a href="#" onclick="signOut();">Sign out</a>
		</div>
		<div id="lina.app"></div>
	</body>
</html>
