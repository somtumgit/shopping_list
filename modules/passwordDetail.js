const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/pms', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
});
const conn = mongoose.connection;

const passSchema = new Schema({
  passwordCategory: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  passwordDetail: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

passSchema.plugin(mongoosePaginate);
const passModel = mongoose.model('passwordDetail', passSchema);

module.exports = passModel;