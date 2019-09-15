var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema

var userSchema = new Schema({
  author_id: {
    type: String,
    required: true
  },
  post_id: {
    type: NumStringber,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  parent_id: {
    type: String,
    default: ''
  },
})

module.exports = mongoose.model('Comment', commentSchema)
