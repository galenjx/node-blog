
const Post = require('../models/post')
const formatDate = require('../public/js/formatDate')
const mongoose = require('mongoose')


const edit_post_list_get = function (req, res, next) {
    if (!req.session.user)
        return res.redirect('/login')
    let user = req.session.user

    let pageControl = {}
    Post
        .find({
            author_id: user._id
        })
        .countDocuments()
        .then(function (count) {
            if (count == 0)
                return res.render('topic/post_list.html', {
                    user: req.session.user,
                    message: '空空如也(*^_^*)'
                })
            let size = 10
            let total_count = count
            let total_page = Math.ceil(total_count / size)
            let page = (JSON.stringify(req.query.page) && !isNaN(parseInt(req.query.page))) ? parseInt(req.query.page) : 1
            if (page < 1) {
                res.redirect('/settings/edit_post_list?page=1')
            }
            if (page > total_page) {
                res.redirect('/settings/edit_post_list?page=' + total_page)
            }
            //计算查询多少,api有点蒙了
            // let query_total = page * size
            //计算越过多少条
            let offset = (page - 1) * size
            // console.log(page,total_page,parseInt(urlObj.query.page))

            //==================================这是用于处理底部页码的数据==========================
            let visiable = 5
            let regin = (visiable - 1) / 2//左右区间
            let begin = page - regin//开始页码
            let end = begin + visiable//结束页码加一
            //可能出现begin,end不合理情况，begin必须大于0
            if (begin < 1) {
                begin = 1
                //这里begin改了end也要修改，用于后期控制按钮数不变;
                end = begin + visiable
            }
            if (end > total_page + 1) {
                //超出范围
                end = total_page + 1
                //begin也做相应更改
                begin = end - visiable
                //但是这里可能页数小于5，重新设置一下
                if (begin < 1) {
                    begin = 1
                }
            }

            //利用begin与end组成一个数组，用于模板便利
            let pageControlLists = []
            for (let i = begin; i < end; i++) {
                pageControlLists.push(i)
            }
            // console.log(page,begin,end,pageControlLists)
            //end必须<=最大页数
            pageControl = {
                pageControlLists: pageControlLists,
                page
            }
            return Post.find({
                author_id: user._id
            })
                .sort({ _id: -1 })
                .limit(size)
                .skip(offset)
        })
        //这个api不支持类似promise的编程吗？
        .then(function (lists) {
            lists.forEach(element => {
                element.last_modified_time = formatDate(element.last_modified_time)
            });
            let finalData = {
                pageControl,
                lists
            }
            res.render('topic/post_list.html', {
                user: req.session.user,
                finalData: finalData
            })
        })
        .catch((err) => next(err))
}

const post_new_get = function (req, res, next) {
    //登陆权限设置
    if (!req.session.user)
        return res.redirect('/login')
    // 返回user以动态改变header结构
    res.render('topic/new.html', {
        user: req.session.user
    })
}




const post_new_post = function (req, res, next) {
    //登陆权限设置
    if (!req.session.user)
        return res.redirect('/login')
    //1.获取表单数据
    //2.处理表单数据，
    //4. 发送响应数据
    let user = req.session.user
    let body = req.body
    if (!body.category_name || !body.title || !body.content)
        return res.status(200).json({
            err_code: 2,
            message: '请填写完整的文章信息'
        })
    body.author_id = user._id
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

}



const posts_delete_post = function (req, res, next) {
    if (!req.session.user)
        return res.redirect('/login')
        console.log(req)
    let id = req.body.id.replace(/"/g, '')
    
    let Oid = mongoose.Types.ObjectId(id);
    let user = req.session.user
    // id = user._id
    // console.log(id[0])
    Post.remove({
        _id: Oid,
        author_id: user._id
    }, function (err) {
        if (err) {
            return next(err)
        }
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}




const post_edit_get = function (req, res, next) {
    //登陆权限设置
    if (!req.session.user)
        return res.redirect('/login')

    let id = req.query.id.replace(/"/g, '')
    let Oid = mongoose.Types.ObjectId(id);
    let user = req.session.user
    Post.findOne({
        _id: Oid,
        author_id: user._id
    }, function (err, result) {
        if (err) {
            // 交给处理错误的中间件
            return next(err)
        }
        res.render('topic/edit.html', {
            user: req.session.user,
            result: result
        })
    })
}



const post_edit_post = function (req, res, next) {
    if (!req.session.user)
        return res.redirect('/login')
    //1.获取表单数据
    //2.处理表单数据，更改修改时间
    //3.根据id更新数据库
    //4. 发送响应数据
    let user = req.session.user
    let body = req.body

    let id = body.id.replace(/"/g, '')
    let Oid = mongoose.Types.ObjectId(id);
    body.last_modified_time = Date.now()

    Post.findOneAndUpdate(
        {
            _id: Oid,
            author_id: user._id
        },
        {
            $set: body
        },
        function (err) {
            if (err) {
                return next(err)
            }
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })

        })
}
module.exports = {
    edit_post_list_get,
    post_new_get,
    post_new_post,
    posts_delete_post,
    post_edit_get,
    post_edit_post
}