
var Post = require('../models/post')
var marked = require('marked')
var mongoose = require('mongoose')
var formatDate = require('../public/js/formatDate')

module.exports = function (req, res, next) {
    // res.render('topic/show.html',{
    //   user:req.session.user
    // })
    // 1. 获取要渲染的文章id
    // 
    // 2. 渲染编辑页面
    //    根据 id 把文章信息,评论内容查出来，
    //    =======注意获取的id有双引号，而且查询时id类型要为ObjectId，这个问题困住我一大个早上==============
    //    使用模板引擎渲染页面
  
  
    //views+1
    // var newPost=null
    // newPost.views = result[0].views + 1
    // new Post(newPost).save(function (err, user) {
    //   if (err) {
    //     return next(err)
    //   }
  
    //   res.status(200).json({
    //     err_code: 0,
    //     message: 'OK'
    //   })
  
    // })
  
  
  
    req.session.post = ''
    var id = req.query.id.replace(/"/g, '')
    Oid = mongoose.Types.ObjectId(id);
    // console.log(Oid)
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
      },
      {
        $match: { _id: { $eq: Oid } }
      }
    ], function (err, result) {
      if (err) {
        // 交给处理错误的中间件
        return next(err)
      }
      req.session.post = result[0]
      // console.log(result[0].content)
      result[0].content = marked(result[0].content)
  
      result[0].comment_detail.forEach(element =>{
        element.created_time = formatDate(element.created_time)
      })
  
  
      res.render('topic/show.html', {
        user: req.session.user,
        result: result[0],
        post: req.session.post
      })
    })
  
  
    //进来先清空文章的session
    // req.session.post=''
    // console.log(req.query.id)
    // Post.findById(req.query.id, function (err, post) {
    //   if (err) {
    //     return next(err)
    //   }
  
    //   // req.session.post=post
  
    //   // posthtml=marked(post.content)
    //   // res.render('topic/show.html', {
    //   //   user:req.session.user,
    //   //   post:posthtml
    //   // })
    // })
  
  
  
  }