var express = require('express')
var User = require('./models/user')
var Post = require('./models/post')
var Comment = require('./models/comment')
var md5 = require('blueimp-md5')
var marked=require('marked')
var multer = require('multer')
var mongoose=require('mongoose')
var fs = require('fs')
// var fs=require('fs')
var router = express.Router()




//+=====================================首页===========================================
router.get('/', function (req, res) {

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
  ],function(err,result){
    if (err) {
      // 交给处理错误的中间件
      return next(err)
    }
    res.render('index.html', {
      user: req.session.user,
      lists: result
    })
  })
  .sort({_id:-1})
  .limit(20)



  
})



//+=====================================登陆===========================================
router.get('/login', function (req, res) {
  res.render('login.html')
})
router.post('/login', function (req, res, next) {
  // 1. 获取表单数据
  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  var body = req.body
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
        message: 'Email or password is invalid.'
      })
    }
    // 用户存在，登陆成功，通过 Session 记录登陆状态
    req.session.user = user
    
    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})




//======================================注册功能=========================================
router.get('/register', function (req, res, next) {
  res.render('register.html')
})

router.post('/register', function (req, res, next) {
  // 1. 获取表单提交的数据
  //    req.body
  // 2. 操作数据库
  //    判断改用户是否存在
  //    如果已存在，不允许注册
  //    如果不存在，注册新建用户
  // 3. 发送响应
  var body = req.body
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
        message: 'Email or nickname aleady exists.'
      })
      return res.send(`邮箱或者密码已存在，请重试`)
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
})







//+=====================================退出登陆===========================================
router.get('/logout', function (req, res) {
  // 清除登陆状态
  req.session.user = null
  // 重定向到登录页
  res.redirect('/login')
})






//+=====================================写文章===========================================
router.get('/posts/new', function (req, res, next) {
  //登陆权限设置
  if(!req.session.user)
  return res.redirect('/login')
  // 返回user以动态改变header结构
  res.render('topic/new.html',{
    user:req.session.user
  })
})

router.post('/posts/new', function (req, res, next) {
  //登陆权限设置
  if(!req.session.user)
  return res.redirect('/login')
  //1.获取表单数据
  //2.处理表单数据，更改修改时间
  //3.根据body更新数据库
  //4. 发送响应数据
  var user = req.session.user
  body=req.body
  if(!body.category_name||!body.title||!body.content)
  return res.status(200).json({
    err_code: 2,
    message: '请填写完整的文章信息'
  })
  body.author_id=user._id
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
  
})






//+=====================================渲染文章，评论===========================================
router.get('/posts/show', function (req, res, next) {
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



  req.session.post=''
  var id = req.query.id.replace(/"/g,'')
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
       $match : { _id : { $eq : Oid }}
     }
  ],function(err,result){
    if (err) {
      // 交给处理错误的中间件
      return next(err)
    }
    req.session.post=result[0]
    // console.log(result[0].content)
    result[0].content=marked(result[0].content)



    // console.log(result[0])
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



})


router.post('/posts/comment', function (req, res, next) {
  //登陆权限设置
  if(!req.session.user)
  return res.redirect('/login')

  //1.获取表单数据
  //2.处理表单数据，更改修改时间
  //3.根据body更新数据库
  //4. 发送响应数据
  var post_S=req.session.post
  var user = req.session.user
  body=req.body
  if(!body.content.trim())
  return res.status(200).json({
    err_code: 2,
    message: '评论不能为空'
  })
  body.author_id=user._id
  body.author_nickname=user.nickname
  body.post_id=post_S._id
  // console.log(body)
  new Comment(body).save(function (err, user) {
    if (err) {
      return next(err)
    }
    
    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })

  })
  
})







//+=====================================个人信息===========================================
router.get('/settings/profile', function (req, res, next) {
  if(!req.session.user)
  return res.redirect('/login')

  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  var user = req.session.user
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

    res.render('settings/profile.html',{
      user:result
    })
  })
})

router.post('/settings/profile', function (req, res, next) {
  if(!req.session.user)
  return res.redirect('/login')
  //1.获取表单数据
  //2.处理表单数据，更改修改时间
  //3.根据id更新数据库
  //4. 发送响应数据
  var user = req.session.user
  id=user._id
  body=req.body
  body.gender=parseInt(body.gender)
  body.last_modified_time=Date.now()
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
})


//处理头像上传问题
var datatime = './public/img'
var storage = multer.diskStorage({
    // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
    destination: datatime,
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        cb(null,  Date.now()+file.originalname);
     }
}); 
var upload = multer({
    storage: storage
});

router.post('/avatar',upload.single('avatar'),function(req,res,next){
    console.log(req.file.path)//req.file文件的具体信息
    // res.send({ret_code: datatime});
    user = req.session.user
    var id = user._id
    var newAvatar = {}
    newAvatar.avatar = '\\'+req.file.path
    newAvatar.last_modified_time = Date.now()
    User.findByIdAndUpdate(id, newAvatar, function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/settings/profile')
  })
});



//+=====================================个人账号===========================================
router.get('/settings/admin', function (req, res, next) {
  if(!req.session.user)
  return res.redirect('/login')

  res.render('settings/admin.html',{
    user:req.session.user
  })
})

router.post('/settings/admin', function (req, res, next) {
  if(!req.session.user)
  return res.redirect('/login')
  //1.获取表单数据
  //2.处理表单数据，更改修改时间
  //3.根据id更新数据库
  //4. 发送响应数据
  var user = req.session.user
  body=req.body
  if(!body.comfirmPassword||!body.currentPassword)
  return res.status(200).json({
    err_code: 2,
    message: '请输入密码'
  })
  if(!(user.password===md5(md5(body.currentPassword)))||!(body.newPassword===body.comfirmPassword))
  return res.status(200).json({
    err_code: 1,
    message: '密码或确认密码错误'
  })
  id=user._id
  let newBody={}
  newBody.password=md5(md5(body.newPassword))
  newBody.last_modified_time=Date.now()
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
})







//+=====================================删除账号===========================================
router.post('/settings/delete', function (req, res, next) {
  if(!req.session.user)
  return res.redirect('/login')
  //1.获取表单数据
  //2.处理表单数据，更改修改时间
  //3.根据id更新数据库
  //4. 发送响应数据
  var user = req.session.user
  body=req.body
  if(!body.currentPassword_delete)
  return res.status(200).json({
    err_code: 2,
    message: '请输入密码'
  })
  if(!(user.password===md5(md5(body.currentPassword_delete))))
  return res.status(200).json({
    err_code: 1,
    message: '密码或确认密码错误'
  })
  id=user._id
  // console.log(id[0])
  User.findByIdAndRemove(id,function (err) {
    if (err) {
      return next(err)
    }
    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

module.exports = router
