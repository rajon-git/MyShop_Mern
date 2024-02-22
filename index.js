const express = require('express');
const dbConnect = require('./config/dbConnect');
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;

const authRouter = require("./routes/authRoute");
const { notFound, errorHandler } = require('./middlewares/errorHandler');

dbConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/user', authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
