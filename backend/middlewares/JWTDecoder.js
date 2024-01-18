const jwt = require("jsonwebtoken");

const JWTDecoder = async (req, res, next) => {
	const { token } = req.body;

	if (!token)
		return res.status(401).json({ msg: "No token, authorization denied" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(400).json({ msg: "Token is not valid" });
	}
};

module.exports = JWTDecoder;