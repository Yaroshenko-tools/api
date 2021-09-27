const protect = (req, res, next) => {
	const referer = req.header('Referer');
  const allowedOrigins = process.env.NODE_ENV === "production" ? ['https://yaroshenko.tools'] : false;

	if (referer &&
		referer.startsWith(process.env.APP_FRONTEND_URL)
	) {
		next();
	} else {
		// next();
		// res.status(666).json('🖕');
		res.status(401).send('Unauthorized');
	}
};

export {protect}
