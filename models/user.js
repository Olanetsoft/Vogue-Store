//importing mongodb database client
const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id){
    this.name = username;
    this.email = email;
    this.cart =cart;// {items: []}
    this.id = id;
  }
  save(){
    const db = getDb();
    return db.collection('users')
    .insertOne(this);
  }

  addToCart(product){
    const cartProductIndex = this.cart.items
    .findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItem = [...this.cart.items];

    if (cartProductIndex >= 0){
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItem[cartProductIndex].quantity = newQuantity;
    }
    else{
      updatedCartItem.push({productId: new ObjectId(product._id), quantity: newQuantity});
    }

    const updatedCart = {
      items: updatedCartItem
    };
    const db = getDb();
    return db
    .collection('users')
    .updateOne(
      {_id: new mongodb.ObjectId(this.id)}, 
      {$set: {cart: updatedCart}}
    )
  }



  static findById(userId){
    const db = getDb();
    return db
    .collection('users')
    .findOne({_id: new mongodb.ObjectId(userId)})
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(err => {
      console.log(err);
  });
  }

}

module.exports = User;
