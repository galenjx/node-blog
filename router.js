const express = require('express')
const multer = require('multer')
const router = express.Router()
const personal_message_settings = require('./routes/personal_message_settings')
const personal_session = require('./routes/personal_session')
const personal_post = require('./routes/personal_post')
const public_handle = require('./routes/public_handle')
const comments_handle = require('./routes/comments_handle')
//+=====================================处理头像工作===========================================
const datatime = './public/img'
let storage = multer.diskStorage({
  // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
  destination: datatime,
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
let upload = multer({
  storage: storage
});


//===================================someTest===========================================

router.get('/a', require('./routes/someTest'))

//+=====================================public_handle===========================================
router.get('/posts/show', public_handle.post_comment_show_get)

router.get('/', public_handle.indexPage_get)
//+=====================================personal_session===========================================
router.get('/login', function (req, res) { res.render('login.html') })

router.post('/login', personal_session.login_post)

router.get('/register', function (req, res, next) { res.render('register.html') })

router.post('/register', personal_session.register_post)

router.get('/logout', function (req, res) { req.session.user = null; res.redirect('/login') })
//+=====================================personal_post===========================================
router.get('/posts/new', personal_post.post_new_get)

router.post('/posts/new', personal_post.post_new_post)
//渲染私人文章列表
router.get('/settings/edit_post_list', personal_post.edit_post_list_get)
//编辑文章
router.get('/topic/edit', personal_post.post_edit_get)
//更改文章
router.post('/topic/edit', personal_post.post_edit_post)
//删除私人文章
router.get('/posts_delete_post', personal_post.posts_delete_post)
//+=====================================comments_handle===========================================

router.post('/posts/comment', comments_handle.post_comment_post)

// router.get('/posts/comment_likes', comments_handle.comment_likes_get)

//+=====================================personal_message_settings===========================================
router.get('/settings/profile', personal_message_settings.settings_profile_get)

router.post('/settings/profile', personal_message_settings.settings_profile_post)

router.post('/avatar', upload.single('avatar'), personal_message_settings.avatar_post);

router.get('/settings/admin', personal_message_settings.settings_admin_get)

router.post('/settings/admin', personal_message_settings.settings_admin_post)

router.post('/settings/delete', personal_message_settings.settings_delete_post)

module.exports = router
