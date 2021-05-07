const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;
const loginRouter = require('./routes/api/login');

app.use(bodyParser.urlencoded({extended: true}));
app.use("/",express.static(__dirname + "/public"));
app.use("/node_modules",express.static(__dirname + "/node_modules"));
console.log(__dirname + "/public");
app.set('view engine', 'ejs')
app.set('views', "public/views");

app.use('/',loginRouter);

app.listen(port,() => {console.log("Server running on port: 3000")})
