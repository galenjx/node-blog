
var User = require('../models/user')
module.exports = function (req, res, next) {
    if (!req.session.user)
      return res.redirect('/login')
  
    // 2. 查询数据库用户名密码是否正确
    // 3. 发送响应数据
    var user = req.session.user
    User.findOne({
      email: user.email,
      password: user.password
    }, function (err, result) {
      // console.log(result.gender)
      if (err) {
        // 交给处理错误的中间件
        return next(err)
      }
      // 如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
      if (!result) {
        return res.status(200).json({
          err_code: 1,
          message: 'Email or password is invalid.'
        })
      }
  
      res.render('settings/profile.html', {
        user: result
      })
    })
  }