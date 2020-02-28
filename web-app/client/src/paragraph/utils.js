export const getRoomNumberFromUrl = function() {
	const url = new URL(window.location.href);
	const roomNumber = url.searchParams.get('roomNumber');
	return roomNumber;
};
