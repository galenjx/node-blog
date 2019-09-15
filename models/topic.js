var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test')

var Schema = mongoose.Schema

var categorySchema = new Schema({
  name: {
    type: Number,
    // 0 分享
    // 1 问答
    // 2 招聘
    // 3 客户端测试 
    enum: [0, 1, 2, 3],
    default: 0
  },
})

module.exports = mongoose.model('Category', categorySchema)
