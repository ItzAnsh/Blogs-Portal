const express = require("express");
const app = express();
const port = 3000;
const UserRoutes = require("./Routes/User.route");
const connectDB = require("./config/database");
const cors = require("cors");
const errorHandler = require("./middlewares/error");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.use(errorHandler);
app.use("/users", UserRoutes);

app.listen(port, () => {
	console.log(`running on port ${port}`);
	// console.log(process.env.MONGO_URI);
	connectDB();
});
