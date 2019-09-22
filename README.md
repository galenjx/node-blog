### aleBlog

使用node.js+mongodb搭建的多人社区（原始的静态html页面是从在某云盘copy过来的，后面页面有少部分更改，在这里我主要练习node.js和数据库设计等相关操作），目前完成的功能有：可以看`路由设计`部分，正在完善中...

### 开发环境

node.js : `10.16.3`

mongodb : `4.2.2`

### 使用

1. 命令行开启mongodb数据库 ：mongod

2. 在项目目录安装依赖并启动服务 ：cnpm i 

   ​							    node app.js  (或者你安装了辅助工具nodemon ：nodemon app.js)

   

3. 浏览器打开：localhost:5000

   ​			

### 数据库设计

#### users

|         | id | email | nickname | password | created_time | last_modified_time | avatar | bio  | gender | birthday | status |
| ------- | ----- | ----- | -------- | -------- | ------------ | ------------------ | ------ | ---- | ------ | -------- | ------ |
| require |    | yes   | yes      | yes      |              |                    |        |      |        |          |        |

#### posts

|         | id   | author_id | category_id | title | content | created_time | last_modified_time | views | likes |
| ------- | ---- | --------- | ----------- | ----- | ------- | ------------ | ------------------ | ----- | ----- |
| require |      | yes       | yes         | yes   | yes     |              |                    |       |       |

#### category

|         | id   | name |
| ------- | ---- | ---- |
| require |      |      |

#### comments

|         | id   | author_id | post_id | content | parent_id | created_time |
| ------- | ---- | --------- | ------- | ------- | --------- | ------------ |
| require |      | yes       | yes     | yes     |           |              |

### 路由设计

没有特殊说明，都是利用session

| 路径                     | 方法 | get参数 | post参数                                | 是否需要登陆 | 备注                 | 完成状态 |
| :----------------------- | ---- | ------- | --------------------------------------- | ------------ | -------------------- | -------- |
| /                        | get  |         |                                         |              | 渲染首页             | ✔        |
| /register                | get  |         |                                         |              | 渲染注册页           | ✔        |
| /register                | post |         | email，nickname，password               |              | 处理注册请求         | ✔        |
| /login                   | get  |         |                                         |              | 渲染登陆页           | ✔        |
| /login                   | post |         | email,password                          |              | 处理登陆请求         | ✔        |
| /logout                  | get  |         |                                         |              | 处理退出请求         | ✔        |
| /settings/profile        | get  |         |                                         | y            | 渲染个人信息页面     | ✔        |
| /settings/profile        | post |         |                                         | y            | 处理更改个人信息请求 | ✔        |
| /settings/admin          | get  |         |                                         | y            | 渲染设置页面         | ✔        |
| /settings/admin          | post |         |                                         | y            | 处理设置请求         | ✔        |
| /topics/show             | get  | post_id |                                         |              | 渲染文章详情页面     | ✔        |
| /topics/new              | get  |         |                                         | y            | 渲染写文章页面       | ✔        |
| /topics/new              | post |         | email/user_id，category，title，content | y            | 处理发表文章请求     | ✔        |
| /topics/comments         | post |         | email/user_id,post_id,content           | y            | 处理评论请求         | ✔        |
| /settings/edit_post_list | get  |         |                                         | y            | 渲染个人文章列表     | ✔        |
| /topic/edit              | get  |         | post._id                                | y            | 渲染编辑文章页       | ✔        |
| /topic/edit              | post |         | user_id，category，title，content       | y            | 处理编辑请求         | ✔        |

### 待完成的功能

最近刷题去了，有空就更。

文章，评论点赞，文章的状态，回复评论，个人对他人可见的主页等，还有想到再写......

### 遇到过困难的点

1. 头像的处理

   本来的思路：在上传文件的表单change事件发生时，发送一个ajax将表单传过去，后台拿到数据后处理，返回一个地址，在客户端拿到地址后将头像的地址更改，并将地址放到一个隐藏域中，等点击确认更改后将其他数据连同隐藏的地址传过去，然后更新数据库，在后台拿数据卡了很久（以为body-parser可以直接拿），后来用中间件multer解决

2. marked语法不够熟悉，以为文章解析出bug

3. 联合查询，两个对于困扰我比较久的点：_id的数据类型，通过url传id时id会有双引号。

4. 更改文章的安全性问题，利用session判断修改者是不是原作者

   