$('#newPost_from').on('submit', function (e) {
    e.preventDefault()
    var formData = $(this).serialize()
    // console.log(formData)
    $.ajax({
      url: '/posts/new',
      type: 'post',
      data: formData,
      dataType: 'json',
      success: function (data) {
        var err_code = data.err_code
        if (err_code === 0) {
          window.alert('发表文章成功！')
          window.location.href = '/'
        }else if (err_code === 2) {
            window.alert(data.message)
        }else if (err_code === 500) {
          window.alert('服务器忙，请稍后重试！')
        }
      }
    })
  })