export const generateToken = (length = 6, type: 'simple' | 'full' | 'extended' = 'simple') => {
	let letters = '';

	switch (type) {
		case 'simple':
			letters += '0123456789';
			break;
		case 'full':
			letters += 'abcdefghijklmnopqrstuvwxyz';
			break;
		case 'extended':
			letters += `_^$@abcdefghijklmnopqrstuvwxyz${'abcdefghijklmnopqrstuvwxyz'.toUpperCase()}`;
			break;
	}

	let OTP = '';

	for (let i = 0; i < length; i++) {
		OTP += letters[Math.floor(Math.random() * letters.length)];
	}

	return OTP;
};
