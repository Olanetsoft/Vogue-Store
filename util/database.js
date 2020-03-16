const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://idris:Hayindehdb2019@cluster0-sszay.mongodb.net/test?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected Successfully');
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = mongoConnect;

