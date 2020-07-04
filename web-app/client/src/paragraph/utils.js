export const getRoomNumberFromUrl = function() {
	const url = new URL(window.location.href);
	const roomNumber = url.searchParams.get('roomNumber');
	return roomNumber;
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
