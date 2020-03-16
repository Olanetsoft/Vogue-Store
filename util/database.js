const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;


const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://idris:Hayindehdb2019@cluster0-sszay.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected Successfully');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database Found !'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

