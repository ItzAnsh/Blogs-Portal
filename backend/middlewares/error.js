// Import utils
const errorHandler = require("../utils/errorHandler");

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		success: false,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};
const sendErrorProd = (err, res) => {
	if (err.isOperaional) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
	} else {
		res.status(500).json({
			success: false,
			message: "Something went very wrong!",
		});
	}
};

const handleError = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";

	// Mongoose bad ObjectId
	if (err.name === "CastError") {
		const message = `Resource not found. Invalid: ${err.path} : ${err.value}`;
		err = new ErrorHandler(message, 400);
	}

	// Handle Mongoose Validation Error

	if (err.name === "ValidationError") {
		const message = Object.values(err.errors).map((value) => value.message);
		err = new ErrorHandler(message, 400);
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		if (Object.keys(err.keyValue)[0] === "email") {
			const message = `Email is already registered`;
			err = new ErrorHandler(message, 400);
		} else {
			const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
			err = new ErrorHandler(message, 400);
		}
	}

	// Wrong JWT error
	if (err.name === "JsonWebTokenError") {
		const message = "JSON Web Token is invalid. Try Again";
		err = new ErrorHandler(message, 400);
	}

	// JWT Expired error
	if (err.name === "TokenExpiredError") {
		const message = "JSON Web Token is expired. Try Again";
		err = new ErrorHandler(message, 400);
	}

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else {
		sendErrorProd(err, res);
	}
};

module.exports = handleError;
