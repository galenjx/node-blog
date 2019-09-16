var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test')

var Schema = mongoose.Schema

var commentSchema = new Schema({
  author_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  author_nickname: {
    type: String,
    required: true
  },
  post_id: {
    type: Schema.Types.ObjectId,
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
  likes: {
    type: Number,
    default: 0
  },
})

module.exports = mongoose.model('Comment', commentSchema)
