const protect = (req, res, next) => {
	const referer = req.header('Referer');
	// console.log(referer);
	if (referer && (
		referer.startsWith('http://localhost') ||
		referer.startsWith('https://yaroshenko.tools/')
	)) {
		next();
	} else {
		// next();
		// res.status(666).json('🖕');
		res.status(401).send('Unauthorized');
	}
};

module.exports = {
	protect
}
