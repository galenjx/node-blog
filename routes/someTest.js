var Post = require('../models/post')
var Comment = require('../models/comment')

var mongoose = require('mongoose')
module.exports = function (req, res, next) {
    var postId=mongoose.Types.ObjectId('d99955ad8cb4a22a09cfacd');
    var authorId=mongoose.Types.ObjectId('5d998bdb3b113125b0ed4883');
    Post.findOne({
        _id: postId
    })
  .then(function (post) {
    
      // 用户不存在，可以注册
      return Comment.find({
        author_id: authorId
      })
    
  })
  .then(function (ret) {
      console.log(ret)
  })
  .catch(err => next(err))
}