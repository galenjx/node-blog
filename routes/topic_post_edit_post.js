
var mongoose = require('mongoose')
var Post = require('../models/post')

module.exports = function (req, res, next) {
    if (!req.session.user)
    return res.redirect('/login')
    //1.获取表单数据
    //2.处理表单数据，更改修改时间
    //3.根据id更新数据库
    //4. 发送响应数据
    var user = req.session.user
    body = req.body
  
    var id = body.id.replace(/"/g, '')
    Oid = mongoose.Types.ObjectId(id);
    body.last_modified_time = Date.now()
  
    Post.findOneAndUpdate(
      { _id: Oid, 
        author_id: user._id 
      }, 
      {
        $set :body
      }, 
      function (err) {
      if (err) {
        return next(err)
      }
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
  
    })
  }