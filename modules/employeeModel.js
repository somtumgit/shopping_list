const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/employee', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});
const conn = mongoose.connection;

const employeeSchema = new Schema({
  name: String,
  email: String,
  etype: String,
  hourlyrate: Number,
  totalHour: Number,
  total: Number,
  date: Date
});

const employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = employeeModel;