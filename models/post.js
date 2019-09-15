var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test')

var Schema = mongoose.Schema

var postSchema = new Schema({
  author_id: {
    type: String,
    required: true
  },
  category_name: {
    type: Number,
    // 0 分享
    // 1 问答
    // 2 招聘
    // 3 客户端测试 
    enum: [0, 1, 2, 3],
    default: 0
  },
  title: {
      type: String,
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
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
})

module.exports = mongoose.model('Post', postSchema)
