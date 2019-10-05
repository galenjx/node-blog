
var Post = require('../models/post')

module.exports = function (req, res, next) {
    //登陆权限设置
    if (!req.session.user)
      return res.redirect('/login')
    //1.获取表单数据
    //2.处理表单数据，更改修改时间
    //3.根据body更新数据库
    //4. 发送响应数据
    var user = req.session.user
    body = req.body
    if (!body.category_name || !body.title || !body.content)
      return res.status(200).json({
        err_code: 2,
        message: '请填写完整的文章信息'
      })
    body.author_id = user._id
    // console.log(body)
    new Post(body).save(function (err, post) {
      if (err) {
        return next(err)
      }
  
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
  
    })
  
  }