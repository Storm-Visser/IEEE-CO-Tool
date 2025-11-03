require('dotenv').config()
const mongoose = require('mongoose')

module.exports = async (app) => {
	// Choose between local Mongo or remote MongoDB Atlas
  const mongoUri =
    process.env.NODE_ENV === 'production'
      ? `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.fcddf.mongodb.net/relative-due-date?retryWrites=true&w=majority`
      : process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/relative-due-date';

  mongoose
    .connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log(`MongoDB connected to ${mongoUri.includes('mongodb+srv') ? 'Atlas' : 'Local instance'}`))
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
};
//ignix is webserver