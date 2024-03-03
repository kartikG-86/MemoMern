const mongoose = require('mongoose')
const mongoURI = 'mongodb://localhost:27017/assignment'

async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Could not connect to MongoDB', err);
    }
}

module.exports = connectToMongoDB;