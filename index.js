const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion, } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://mongoTest:uoXxGH3If0npKhvS@cluster0.mevgws0.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//// Home page a html call
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

///// Database settings
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const productCollection = client.db("mongotest").collection("products");

  // add Product in database
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
      .then(result => {
        console.log('added');
        res.redirect('/')
      })
  })

  /////// Get all product from database
  app.get('/products', (req, res) => {
    productCollection.find({}).limit(10)
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  ///// Single product call in edit form
  app.get('/edit/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, document) => {
      res.send(document[0])
    })
  })

  ///// update product in database
  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({_id: ObjectId(req.params.id)}, {
      $set: {
        price: req.body.price, quantity: req.body.quantity
      }
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })

  })

  /////// Delete product from database
  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })

});


app.listen(3000)