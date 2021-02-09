export const getroomIdFromUrl = function() {
	const url = new URL(window.location.href);
	const roomId = url.searchParams.get('roomId');
	return roomId;
};

export const getUserEmail = function() {
	return getCookie('email');
};

export const getGivenName = function() {
	return getCookie('given-name');
};

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2)
		return parts
			.pop()
			.split(';')
			.shift();
}
