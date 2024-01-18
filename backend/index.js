const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const adminRoute = require("./routes/admin");
dotenv.config();

// console.log(process.env.MONGODB_URI);

//database
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("database is connected successfully!");
	} catch (err) {
		console.log(err);
	}
};

//middlewares
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/admin", adminRoute);

const upload = multer({ dest: "images/" });
app.post("/api/upload", upload.single("file"), (req, res) => {
	console.log("reached image req");
	res.status(200).json("Image has been uploaded successfully!");
});

app.listen(process.env.PORT, () => {
	connectDB();
	console.log("app is running on port " + process.env.PORT);
});
