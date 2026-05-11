const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require("./src/models/User.model");
  const users = await User.find({}, "name email role");
  console.log(users);
  process.exit();
});