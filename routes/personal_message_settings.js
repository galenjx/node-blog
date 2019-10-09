
const User = require('../models/user')
const md5 = require('blueimp-md5')

const settings_admin_get = function (req, res, next) {
  if (!req.session.user)
    return res.redirect('/login')

  res.render('settings/admin.html', {
    user: req.session.user
  })
}



const settings_admin_post = function (req, res, next) {
  if (!req.session.user)
    return res.redirect('/login')
  //1.获取表单数据
  //2.处理表单数据，更改修改时间
  //3.根据id更新数据库
  //4. 发送响应数据
  let user = req.session.user
  let body = req.body
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
  let id = user._id
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


const settings_delete_post = function (req, res, next) {
  if (!req.session.user)
    return res.redirect('/login')
  //1.获取表单数据
  //2.处理表单数据，
  //3.根据id更新数据库
  //4. 发送响应数据
  let user = req.session.user
  let body = req.body
  if (!body.currentPassword_delete)
    return res.status(200).json({
      err_code: 2,
      message: '请输入密码'
    })
  if (!(user.password === md5(md5(body.currentPassword_delete))))
    return res.status(200).json({
      err_code: 1,
      message: '密码或确认密码错误'
    })
  let id = user._id
  // console.log(id[0])
  User.findByIdAndRemove(id, function (err) {
    if (err) {
      return next(err)
    }
    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
}


const settings_profile_get = function (req, res, next) {
  if (!req.session.user)
    return res.redirect('/login')
    
  let user = req.session.user
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



const settings_profile_post = function (req, res, next) {
  if (!req.session.user)
    return res.redirect('/login')
  //1.获取表单数据
  //2.处理表单数据，更改修改时间
  //3.根据id更新数据库
  //4. 发送响应数据
  let user = req.session.user
  let id = user._id
  let body = req.body
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


const avatar_post = function (req, res, next) {
  console.log(req.file.path)//req.file文件的具体信息
  // res.send({ret_code: datatime});
  let user = req.session.user
  let id = user._id
  let newAvatar = {}
  newAvatar.avatar = '\\' + req.file.path
  newAvatar.last_modified_time = Date.now()
  User.findByIdAndUpdate(id, newAvatar, function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/settings/profile')
  })
}

module.exports = {
  settings_admin_get,
  settings_admin_post,
  settings_delete_post,
  settings_profile_get,
  settings_profile_post,
  avatar_post
}