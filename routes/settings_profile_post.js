
var User = require('../models/user')
module.exports = function (req, res, next) {
    if (!req.session.user)
      return res.redirect('/login')
    //1.获取表单数据
    //2.处理表单数据，更改修改时间
    //3.根据id更新数据库
    //4. 发送响应数据
    var user = req.session.user
    id = user._id
    body = req.body
    body.gender = parseInt(body.gender)
    body.last_modified_time = Date.now()
    // console.log(id[0])
    User.findByIdAndUpdate(id, body, function (err) {
      if (err) {
        return next(err)
      }
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
  
    })
  }