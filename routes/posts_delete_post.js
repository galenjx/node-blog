var Post = require('../models/post')
var mongoose = require('mongoose')

module.exports = function (req, res, next) {
    if (!req.session.user)
      return res.redirect('/login')

    var id = req.query.id.replace(/"/g, '')
    Oid = mongoose.Types.ObjectId(id);

    var user = req.session.user

    id = user._id
    // console.log(id[0])
    Post.remove({
        _id: Oid,
        author_id: user._id
    }, function (err) {
      if (err) {
        return next(err)
      }
      res.redirect('/settings/edit_post_list')
    })
  }