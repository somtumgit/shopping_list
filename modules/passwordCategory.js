const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/pms', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
});
const conn = mongoose.connection;

const passcatSchema = new Schema({
  passwordCategory: {
    type: String,
    required: true,
    index: {
        unique: true
    }
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const passCateModel = mongoose.model('passwordCategory', passcatSchema);

module.exports = passCateModel;