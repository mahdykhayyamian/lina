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
		<script>
			function onSuccess(googleUser) {
			  var profile = googleUser.getBasicProfile();
			  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
			  console.log('Name: ' + profile.getName());
			  console.log('given name :' + profile.getGivenName())
			  console.log('family name :' + profile.getFamilyName())
			  console.log('Image URL: ' + profile.getImageUrl());
			  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

			  const userName = document.getElementById("user-name");
			  console.log(userName);

			  const loginForm = document.getElementById("login-form");
			  console.log(loginForm);

			  userName.value = profile.getGivenName();

			  console.log(userName.value);

			  loginForm.submit();
		    }
		    function onFailure(error) {
		      console.log(error);
		    }

			function renderButton() {
		      gapi.signin2.render('my-signin2', {
		        'scope': 'profile email',
		        'width': 240,
		        'height': 50,
		        'longtitle': true,
		        'theme': 'dark',
		        'onsuccess': onSuccess,
		        'onfailure': onFailure
		      });
		    }

		</script>
		<title>Login</title>
	</head>



	<body class="login">
		<div>
			<form id="login-form" action='<%= request.getAttribute("action") %>' method="post">
				<div class="hidden">
					<input id="user-name" type="text" name="userName" placeholder="Pick a name">
				</div>
				<div id="my-signin2"></div>
			</form>
		</div>

	</body>
</html>
