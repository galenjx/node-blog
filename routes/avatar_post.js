
var User = require('../models/user')
module.exports = function (req, res, next) {
    console.log(req.file.path)//req.file文件的具体信息
    // res.send({ret_code: datatime});
    user = req.session.user
    var id = user._id
    var newAvatar = {}
    newAvatar.avatar = '\\' + req.file.path
    newAvatar.last_modified_time = Date.now()
    User.findByIdAndUpdate(id, newAvatar, function (err) {
      if (err) {
        return next(err)
      }
      res.redirect('/settings/profile')
    })
  }