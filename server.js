const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/url', function(req, res) {
    const url = req.body.url;

    res.send(url);
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));