export const string = (obj) => {
	return JSON.stringify(obj, null, 4);
};

export const parse = (str) => {
	return JSON.parse(str, null, 4);
};
