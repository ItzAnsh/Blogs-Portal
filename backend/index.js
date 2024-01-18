const express = require("express");
const app = express();
const port = 4000;
const connectDB = require("./config/database");
const cors = require("cors");
const errorHandler = require("./middlewares/error");

// import Routes
const UserRoutes = require("./Routes/User.route");
const BlogRoutes = require("./Routes/Blogs.route");
const UserBlogRoutes = require("./Routes/UserBlogs.route");

// middlewares
// const JWTDecoder = require("./middlewares/JWTDecoder");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.use(errorHandler);
app.use("/users", UserRoutes);
app.use("/blogs", BlogRoutes);
app.use("/usersblogs", UserBlogRoutes);

app.listen(port, () => {
	console.log(`running on port ${port}`);
	connectDB();
});
