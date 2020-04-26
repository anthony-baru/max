const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;
class Product {

  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    let dbOp;
    const db = getDb();
    if (this._id) {
      //update
      dbOp = db
        .collection('products')
        .update({ _id: this._id }, { $set: this });
    } else {
      //create new product
      dbOp = db
        .collection('products')
        .insertOne(this)
    }
    return dbOp.then(result => { })
      .catch(err => { console.log(err) });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(result => {
        console.log('Deleted', result);
      })
      .catch(err => { console.log(err) })
  }
}
module.exports = Product;