var Post = require('../models/post')
var formatDate = require('../public/js/formatDate')
var url = require('url')
module.exports = function (req, res) {
  var urlObj = url.parse(req.url, true)


  Post
    .countDocuments()
    .then(function (count) {
      if (count == 0)
        return res.render('index.html', {
          user: req.session.user,
          message: '空空如也(*^_^*)'
        })
      var size = 10
      var total_count = count
      var total_page = Math.ceil(total_count / size)
      var page = (JSON.stringify(urlObj.query.page) && !isNaN(parseInt(urlObj.query.page))) ? parseInt(urlObj.query.page) : 1
      if (page < 1) {
        res.redirect('/?page=1')
      }

      if (page > total_page) {
        res.redirect('/?page=' + total_page)
      }
      //计算查询多少
      var query_total = page * size
      //计算越过多少条
      var offset = (page - 1) * size
      // console.log(page,total_page,parseInt(urlObj.query.page))

      //==================================这是用于处理底部页码的数据==========================
      var visiable = 5
      var regin = (visiable - 1) / 2//左右区间
      var begin = page - regin//开始页码
      var end = begin + visiable//结束页码加一

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
      var pageControlLists = []
      for (var i = begin; i < end; i++) {
        pageControlLists.push(i)
      }
      // console.log(page,begin,end,pageControlLists)
      //end必须<=最大页数
      var pageControl = {
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
    
    .then(function (lists) {
          lists.forEach(element => {
            element.last_modified_time = formatDate(element.last_modified_time)
          });
          var finalData = {
            pageControl,
            lists
          }
          // console.log(finalData)
          res.render('index.html', {
            user: req.session.user,
            finalData: finalData
          })
        })
      })
      // .catch((err) => next(err))
    

}