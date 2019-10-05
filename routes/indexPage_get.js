var Post = require('../models/post')
var formatDate = require('../public/js/formatDate')
module.exports = function (req, res) {

    Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "user_detail"
        }
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post_id",
          as: "comment_detail"
        }
      }
    ], function (err, result) {
      if (err) {
        // 交给处理错误的中间件
        return next(err)
      }
      result.forEach(element => {
        element.last_modified_time=formatDate(element.last_modified_time)
      });
      // console.log(result)
      res.render('index.html', {
        user: req.session.user,
        lists: result
      })
    })
      .sort({ _id: -1 })
      .limit(20)
  }