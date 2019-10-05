
var Comment = require('../models/comment')
module.exports = function (req, res, next) {
    //登陆权限设置
    if (!req.session.user)
      return res.redirect('/login')
  
    //1.获取表单数据
    //2.处理表单数据，更改修改时间
    //3.根据body更新数据库
    //4. 发送响应数据
    var post_S = req.session.post
    var user = req.session.user
    body = req.body
    if (!body.content.trim())
      return res.status(200).json({
        err_code: 2,
        message: '评论不能为空'
      })
    body.author_id = user._id
    body.author_nickname = user.nickname
    body.post_id = post_S._id
    // console.log(body)
    new Comment(body).save(function (err, user) {
      if (err) {
        return next(err)
      }
  
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
  
    })
  
  }