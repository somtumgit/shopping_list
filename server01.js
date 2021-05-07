const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const items = require('./routes/api/items');
const path = require('path');
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

const PUBLIC_PATH = path.resolve(__dirname, "client", "build");
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${port}`;

console.log(PUBLIC_PATH)
console.log(PUBLIC_URL)
console.log(process.env.NODE_ENV)

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

app.get('/form', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/form/url', function(req, res) {
    //app.use(bodyParser.urlencoded({extended: true}));
    const url = req.body.url;

    res.send(url);
});

if(process.env.NODE_ENV === 'production') {
    const indexHtml = path.join(PUBLIC_PATH, "index.html");
    const indexHtmlContent = fs
  .readFileSync(indexHtml, "utf-8")
  .replace(/__PUBLIC_URL_PLACEHOLDER__/g, PUBLIC_URL);
    //set static folder
    //app.use(express.static('client/build'));
    app.use(express.static(path.join(PUBLIC_PATH)));
    
    app.get('*', (req, res) => {
        //res.sendFile(path.resolve(__dirname,'client','build','index.html'));
        res.send(indexHtmlContent);
    });

    // app.get('/*', function (req, res) {
    //     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    // });
}

app.listen(port, () => console.log(`Server started on port ${port}`));







// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://mern01:<password>@cluster0.7x7ke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });