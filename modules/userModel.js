const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/pms', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
});
const conn = mongoose.connection;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: {
        unique: true
    }
  },
  email: {
    type: String,
    required: true,
    index: {
        unique: true
    }
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;