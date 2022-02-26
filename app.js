require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// for saving image in server
const fileUpload = require("express-fileupload");

// for saving image in cloud
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// database
const connectDB = require('./db/connect');

// routes
const productRoutes = require("./routes/productRoutes");

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static("./public"));
app.use(express.json());
// app.use(fileUpload());  for local
app.use(fileUpload({useTempFiles: true}));  // for cloud option

app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});

app.use("/api/v1/products", productRoutes);

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
