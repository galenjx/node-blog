
module.exports = function (req, res, next) {
    //登陆权限设置
    if (!req.session.user)
      return res.redirect('/login')
    // 返回user以动态改变header结构
    res.render('topic/new.html', {
      user: req.session.user
    })
  }