
var User = require('../models/user')
var md5 = require('blueimp-md5')

module.exports = function (req, res, next) {
    // 1. 获取表单数据
    // 2. 查询数据库用户名密码是否正确
    // 3. 发送响应数据
    var body = req.body
    User.findOne({
      email: body.email,
      password: md5(md5(body.password))
    }, function (err, user) {
      // console.log(user)
      if (err) {
        // 交给处理错误的中间件
        return next(err)
      }
      // 如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
      if (!user) {
        return res.status(200).json({
          err_code: 1,
          message: 'Email or password is invalid.'
        })
      }
      // 用户存在，登陆成功，通过 Session 记录登陆状态
      req.session.user = user
  
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    })
  }