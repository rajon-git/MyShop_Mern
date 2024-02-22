const express = require('express');
const dbConnect = require('./config/dbConnect');
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;

const authRouter = require("./routes/authRoute");

dbConnect();

app.use('api/user', authRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
