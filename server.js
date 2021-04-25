const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const items = require('./routes/api/items')
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;;


//  Bodyparser Middleware
//app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.urlencoded({extended: true}));

// DB Config
const db = require('./config/keys').mongoURI
console.log(db)

// DB Connect to Mongo
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

// use Routes
app.use('/api/items', items)

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/url', function(req, res) {
    //app.use(bodyParser.urlencoded({extended: true}));
    const url = req.body.url;

    res.send(url);
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));







// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://mern01:<password>@cluster0.7x7ke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });