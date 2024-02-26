const express = require('express');
const dbConnect = require('./config/dbConnect');
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.PORT || 4000;

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const morgan = require("morgan");

dbConnect();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
