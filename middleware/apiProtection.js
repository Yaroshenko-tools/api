const protect = (req, res, next) => {
	const referer = req.header('Referer');
	// console.log(referer);
	if (referer && (
		referer.indexOf('http://localhost:8080/') !== -1 ||
		referer.indexOf('https://yaroshenko.tools/') !== -1
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
