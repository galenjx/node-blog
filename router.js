var express = require('express')
var multer = require('multer')
var router = express.Router()

//+=====================================处理头像工作===========================================
var datatime = './public/img'
var storage = multer.diskStorage({
  // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
  destination: datatime,
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
var upload = multer({
        storage: storage
      });
//+=====================================首页===========================================
router.get('/', require('./routes/indexPage_get'))
//+=====================================登陆===========================================
router.get('/login', function (req, res) { res.render('login.html') })

router.post('/login', require('./routes/login_post'))
//======================================注册功能=========================================
router.get('/register', function (req, res, next) { res.render('register.html')})

router.post('/register', require('./routes/register_post'))
//+=====================================退出登陆===========================================
router.get('/logout', function (req, res) { req.session.user = null; res.redirect('/login')})
//+=====================================写文章===========================================
router.get('/posts/new', require('./routes/post_new_get'))

router.post('/posts/new', require('./routes/post_new_post'))
//=========================================编辑文章=============================================
//渲染私人文章列表
router.get('/settings/edit_post_list', require('./routes/edit_post_list_get'))
//编辑文章
router.get('/topic/edit', require('./routes/topic_post_edit_get'))
//更改文章
router.post('/topic/edit', require('./routes/topic_post_edit_post'))
//删除私人文章
router.get('/posts_delete_post', require('./routes/posts_delete_post'))
//+=====================================渲染文章，评论===========================================
router.get('/posts/show', require('./routes/post_comment_get'))

router.post('/posts/comment', require('./routes/post-comment_post'))
//+=====================================个人信息===========================================
router.get('/settings/profile', require('./routes/settings_profile_get'))

router.post('/settings/profile', require('./routes/settings_profile_post'))

router.post('/avatar', upload.single('avatar'), require('./routes/avatar_post'));
//+=====================================个人账号===========================================
router.get('/settings/admin', require('./routes/settings_admin_get'))

router.post('/settings/admin', require('./routes/settings_admin_post'))
//+====================================删除账号===========================================
router.post('/settings/delete',require('./routes/settings_delete_post'))

module.exports = router
