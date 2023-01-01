const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold) //uses the colors npm
  } catch (err) {
    console.error(err.message);
    process.exit(1);  //exit process with failure
  }
}

module.exports = connectDB;