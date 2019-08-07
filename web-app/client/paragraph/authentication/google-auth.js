// Reference: https://developers.google.com/identity/sign-in/web/build-button

function onSuccess(googleUser) {
	var profile = googleUser.getBasicProfile();
	console.log('given name :' + profile.getGivenName())
	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

	const userName = document.getElementById("user-name");
	userName.value = profile.getGivenName();

	const googleAuthToken = document.getElementById("google-auth-token");
	googleAuthToken.value = googleUser.getAuthResponse().id_token;

	const loginForm = document.getElementById("login-form");
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