const express = require('express');
const dbConnect = require('./config/dbConnect');
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;

const authRouter = require("./routes/authRoute");

dbConnect();

// Use express.json() and express.urlencoded() instead of bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Fix the route definition
app.use('/api/user', authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
