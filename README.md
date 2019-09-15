### aleBlog

使用node.js+mongodb搭建的多人社区（静态html页面是从在某云盘copy过来的，在这里我主要练习node.js和数据库设计等相关操作），

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

| 路径              | 方法 | get参数 | post参数                                | 是否需要登陆 | 备注                 | 完成状态   |
| :---------------- | ---- | ------- | --------------------------------------- | ------------ | -------------------- | ---------- |
| /                 | get  |         |                                         |              | 渲染首页             | ✔          |
| /register         | get  |         |                                         |              | 渲染注册页           | ✔          |
| /register         | post |         | email，nickname，password               |              | 处理注册请求         | ✔          |
| /login            | get  |         |                                         |              | 渲染登陆页           | ✔          |
| /login            | post |         | email,password                          |              | 处理登陆请求         | ✔          |
| /logout           | get  |         |                                         |              | 处理退出请求         | ✔          |
| /settings/profile | get  |         |                                         | y            | 渲染个人信息页面     | ✔          |
| /settings/profile | post |         |                                         | y            | 处理更改个人信息请求 | 差头像处理 |
| /settings/admin   | get  |         |                                         | y            | 渲染设置页面         | ✔          |
| /settings/admin   | post |         |                                         | y            | 处理设置请求         | ✔          |
| /topics/show      | get  | post_id |                                         |              | 渲染文章详情页面     |            |
| /topics/new       | get  |         |                                         | y            | 渲染写文章页面       | ✔          |
| /topics/new       | post |         | email/user_id，category，title，content | y            | 处理发表文章请求     | ✔          |
| /topics/comments  | post |         | email/user_id,post_id,content           | y            | 处理评论请求         | ✔          |

### 遇到过困难的点

1. 头像的处理（未完成）
2. marked语法
3. 联合查询