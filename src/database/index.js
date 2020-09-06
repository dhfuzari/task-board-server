// mongodb connection file

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mongoUri = 'mongodb://localhost:27017/api_nodejs_express_mongo';
const mongoOptions = {
    auth: { "authSource": "admin" },
    user: "root",
    pass: "example",
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
};

mongoose.connect(mongoUri, mongoOptions);

module.exports = mongoose
