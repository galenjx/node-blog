const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const router = require('./router')

const app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))


app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 其实默认就是 ./views 目录

// 在 app.use(router)前配置解析表单 POST 请求中间件， parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 在 Express 这个框架中，默认不支持 Session 和 Cookie
// 当把这个插件配置好之后，我们就可以通过 req.session 来发访问和设置 Session 成员了
app.use(session({
  // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密 目的是为了增加安全性，防止客户端恶意伪造
  secret: 'galenjx_code',
  resave: false,
  // 无论是否使用 Session ，都默认直接给你分配一把钥匙
  saveUninitialized: false 
}))

// 把路由挂载到 app 中
app.use(router)

// 配置一个处理 404 的中间件
app.use(function (req, res) {
  res.render('404.html')
})

// 配置一个全局错误处理中间件
app.use(function (err, req, res, next) {
  res.status(500).json({
    err_code: 500,
    message: err.message
  })
})

app.listen(5000, function () {
  console.log('running...')
})
