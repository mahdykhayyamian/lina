import ajax from '@fdaciuk/ajax';

const ajaxProvider = {
	provide: () => {
		return ajax;
	}
};

export { ajaxProvider };
