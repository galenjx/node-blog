const Post = require('../models/post')
const formatDate = require('../public/js/formatDate')
const marked = require('marked')
const mongoose = require('mongoose')


const indexPage_get = function (req, res, next) {
    //保存页码信息的对象
    let pageControl = {}
    Post
        .countDocuments()
        .then(function (count) {
            if (count == 0)
                return res.render('index.html', {
                    user: req.session.user,
                    message: '空空如也(*^_^*)'
                })
            let size = 10
            let total_count = count
            let total_page = Math.ceil(total_count / size)
            let page = (JSON.stringify(req.query.page) && !isNaN(parseInt(req.query.page))) ? parseInt(req.query.page) : 1
            if (page < 1) {
                res.redirect('/?page=1')
            }

            if (page > total_page) {
                res.redirect('/?page=' + total_page)
            }
            //计算查询多少
            let query_total = page * size
            //计算越过多少条
            let offset = (page - 1) * size
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
            return Post.aggregate([
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
            ])
                .sort({ _id: -1 })
                .limit(query_total)
                .skip(offset)
        })
        .then(function (lists) {
            lists.forEach(element => {
                element.last_modified_time = formatDate(element.last_modified_time)
            });
            let finalData = {
                pageControl,
                lists
            }
            // console.log(finalData)
            res.render('index.html', {
                user: req.session.user,
                finalData: finalData
            })
        })
        .catch((err) => next(err))
}




const post_comment_show_get = function (req, res, next) {

    req.session.post = ''
    let finResult = {}
    let id = req.query.id.replace(/"/g, '')
    let Oid = mongoose.Types.ObjectId(id);
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
    ])
    .then(function (result) {
        req.session.post = result[0]._id
        // console.log(result[0].content)
        result[0].content = marked(result[0].content)

        result[0].comment_detail.forEach(element => {
            element.created_time = formatDate(element.created_time)
        })

        finResult = result[0]

        let updateV = {}
        updateV.views = result[0].views + 1
        return Post.findOneAndUpdate(
        {
            _id: Oid,
        },
        {
            $set: updateV
        })
    })
    .then(function (data) {
        res.render('topic/show.html', {
            user: req.session.user,
            result: finResult,
            post: req.session.post
        })
    })
    .catch(err => next(err))
    
}

module.exports = {
    indexPage_get,
    post_comment_show_get
}