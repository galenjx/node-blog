
var Post = require('../models/post')
var mongoose = require('mongoose')


module.exports = function (req, res, next) {
    //登陆权限设置
    if (!req.session.user)
      return res.redirect('/login')

    var id = req.query.id.replace(/"/g, '')
    Oid = mongoose.Types.ObjectId(id);
    Post.findOne({
      _id: Oid
    }, function (err, result) {
      if (err) {
        // 交给处理错误的中间件
        return next(err)
      }
      res.render('topic/edit.html', {
        user: req.session.user,
        result: result
      })
    })
  }