const mongodb = require('mongodb');
const getDb = require('../util/db').getDb;
class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }
  save() {
    let dbOp;
    const db = getDb();
    if (this._id) {
      //update
      dbOp.db.collection('products').update({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      //create new product
      dbOp = db.collection('products')
        .insertOne(this)
    }
    return dbOp.then(result => {
      console.log(result)
    })
      .catch(err => { console.log(err) });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products, 'model');
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
}
module.exports = Product;