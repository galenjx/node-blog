
const User = require('../models/user')
const md5 = require('blueimp-md5')

const login_post = function (req, res, next) {
  // 1. 获取表单数据
  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  let body = req.body
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
        message: '邮箱或者密码错误'
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



const register_post = function (req, res, next) {
  // 1. 获取表单提交的数据
  //    req.body
  // 2. 操作数据库
  //    判断改用户是否存在
  //    如果已存在，不允许注册
  //    如果不存在，注册新建用户
  // 3. 发送响应
  let body = req.body
  User.findOne({
    $or: [{
      email: body.email
    },
    {
      nickname: body.nickname
    }
    ]
  }, function (err, data) {
    if (err) {
      // 交给处理错误的中间件
      return next(err)
    }
    if (data) {
      // 邮箱或者昵称已存在
      return res.status(200).json({
        err_code: 1,
        message: '邮箱或者密码已存在，请重试'
      })
    }

    body.password = md5(md5(body.password))

    new User(body).save(function (err, user) {
      if (err) {
        return next(err)
      }

      // 注册成功，使用 Session 记录用户的登陆状态
      req.session.user = user
      // Express 提供了一个响应方法：json，该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
      // 服务端重定向只针对同步请求才有效，异步请求无效
      // res.redirect('/')
    })
  })
}


module.exports = {
  login_post,
  register_post
}