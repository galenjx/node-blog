
var Post = require('../models/post')

module.exports = function (req, res, next) {
    //登陆权限设置
    if (!req.session.user)
      return res.redirect('/login')
    // 返回user以动态改变header结构
  
  
    var user = req.session.user
    Post.find({
      author_id: user._id
    }, function (err, result) {
      if (err) {
        // 交给处理错误的中间件
        return next(err)
      }
      res.render('topic/post_list.html', {
        user: req.session.user,
        result: result
      })
    })
  
  }