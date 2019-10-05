
var User = require('../models/user')
var md5 = require('blueimp-md5')

module.exports = function (req, res, next) {
    if (!req.session.user)
      return res.redirect('/login')
    //1.获取表单数据
    //2.处理表单数据，更改修改时间
    //3.根据id更新数据库
    //4. 发送响应数据
    var user = req.session.user
    body = req.body
    if (!body.comfirmPassword || !body.currentPassword)
      return res.status(200).json({
        err_code: 2,
        message: '请输入密码'
      })
    if (!(user.password === md5(md5(body.currentPassword))) || !(body.newPassword === body.comfirmPassword))
      return res.status(200).json({
        err_code: 1,
        message: '密码或确认密码错误'
      })
    id = user._id
    let newBody = {}
    newBody.password = md5(md5(body.newPassword))
    newBody.last_modified_time = Date.now()
    // console.log(id[0])
    User.findByIdAndUpdate(id, newBody, function (err) {
      if (err) {
        return next(err)
      }
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
  
    })
  }