$('#comment_posts').on('submit', function (e) {
    e.preventDefault()
    var formData = $(this).serialize()
    // console.log(formData)
    $.ajax({
      url: '/posts/comment',
      type: 'post',
      data: formData,
      dataType: 'json',
      success: function (data) {
        var err_code = data.err_code
        if (err_code === 0) {
          window.alert('发表评论成功！！')
          //插入一条评论


        }else if (err_code === 2) {
            window.alert(data.message)
        }else if (err_code === 500) {
          window.alert('服务器忙，请稍后重试！')
        }
      }
    })
  })