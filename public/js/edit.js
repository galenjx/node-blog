$('#editPost_from').on('submit', function (e) {
    e.preventDefault()
    var formData = $(this).serialize()
    // console.log(formData)
    $.ajax({
      url: '/topic/edit',
      type: 'post',
      data: formData,
      dataType: 'json',
      success: function (data) {
        var err_code = data.err_code
        if (err_code === 0) {
          window.alert('更改文章成功！')
          window.location.reload()
        }else if (err_code === 1) {
          window.alert(data.message)
        }else if (err_code === 500) {
          window.alert('服务器忙，请稍后重试！')
        }
      }
    })
  })

