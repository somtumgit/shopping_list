var express = require('express');
const bodyParser = require('body-parser');
const Twig = require("twig");

var app = express();
const employeeRouter = require('./routes/api/employee');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
console.log(__dirname + "/public");
app.set('view engine', 'twig')
app.set('views', "public/views");

app.use('/',employeeRouter);

app.listen(3000,() => {console.log("Server running on port: 3000")})
