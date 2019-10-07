post_ajax('#comment_posts', '/posts/comment', function () {
  window.alert('发表评论成功！！')
  location.reload()
})





$('body').on("click", '#likes', function (e) {
  e.preventDefault()
  var iObj = $(e.target)
  iObj.toggleClass('red')
  // var likesNumber = iObj.parent().parent()
  // console.log(parseInt(likesNumber.text()))
  // $.ajax({
  //   type: "get",
  //   url: "/posts/comment_likes",
  //   success: function (data) {
  //     if (data.err_message === 0) {
  //       iObj.toggleClass('red')
  //     }
  //     else {
  //       iObj.toggleClass('red')
  //     }
  //   }
  // })
});