const express = require('express');
const dbConnect = require('./config/dbConnect');
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;

// Uncomment and use the dbConnect function
dbConnect();

app.use("/", (req,res)=>{
    res.send("Hello from server");
});

// Comment out this section if you are using dbConnect
// mongoose
//   .connect(process.env.DB_URL)
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch((error) => console.log(error));

// Use this section if you are using dbConnect
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
