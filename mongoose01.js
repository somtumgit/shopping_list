const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
//id: ObjectId,
const employeeSchema = new Schema({
  name: String,
  email: String,
  etype: String,
  hourlyrate: Number,
  totalHour: Number,
  total: Number,
  date: Date
});

employeeSchema.methods.totalSalary = function() {
    //console.log(this.hourlyrate)
    //console.log(this.totalHour)
    //console.log("Income of %s: %d", this.name, (this.hourlyrate * this.totalHour))
    return (this.hourlyrate * this.totalHour);
}

const employeeModel = mongoose.model('Employee', employeeSchema);

mongoose.connect('mongodb://localhost:27017/employee', {useNewUrlParser: true, useUnifiedTopology: true});
const conn = mongoose.connection;

const employee = new employeeModel({
    name: 'Guest02',
    email: 'Guest02@gmail.com',
    etype: 'hourly',
    hourlyrate: 30,
    totalHour: 15,
    date: Date()
});


employee.total = employee.totalSalary()
//console.log(employee)

conn.on("connected", function() {
  console.log('MongoDB Connected...')
});

conn.on("disconnected", function() {
  console.log('MongoDB Disconnected...')
});

conn.on("error", function(err) {
  console.log('MongoDB Connection Error...')
  console.log(err)
});

conn.once("open", function(){
  // employee.save(function(err,res) {
  //   if(err) throw err;
  //   console.log(res);
  //   conn.close();
  // });
});


// employeeModel.find({},function(err, data){
//   if(err) throw err;
//   console.log(data);
//   conn.close();
// });

// employeeModel.find({name: "Guest03"},function(err, data){
//   if(err) throw err;
//   console.log(data);
//   conn.close();
// });

// employeeModel.findOneAndUpdate({totalHour: 16}, {totalHour: 30},function(err, data){
//   if(err) throw err;
//   console.log(data);
//   conn.close();
// });

// employeeModel.findById({_id: "608c277928fa8b1d684e5e62"},function(err, data){
//   if(err) {throw err;}
//   console.log(data);
//   conn.close();
// });














