const { connect } = require("http2");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.set("strictQuery", false);

const connectDB = async () => {
	mongoose.connect(process.env.MONGO_URI).then((conn) => {
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	});
};

// Trying to reconnect to the database if the connection is lost

mongoose.connection.on("disconnected", () => {
	console.log("Database is disconnected");
});

mongoose.connection.on("connected", () => {
	console.log("Database is connected");
});

module.exports = connectDB;
