require('dotenv').config()
    // The database connection, the app uses a mongoDB ,whcih cna be acceses in Mongo compass or through code.
    // It is not hosted on the server at NTNU, but a service from MONGODB
const mongoose = require('mongoose')
const mongoURI = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.fcddf.mongodb.net/relative-due-date?retryWrites=true&w=majority`
module.exports = async(app) => {
    mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => console.log('MongoDB connected'))
        .catch(err => {
            console.log(err)
            process.exit(1)
        })
}