//更新密码
$('#upDateAdmin_from').on('submit', function (e) {
    e.preventDefault()
    var formData = $(this).serialize()
    // console.log(formData)
    $.ajax({
      url: '/settings/admin',
      type: 'post',
      data: formData,
      dataType: 'json',
      success: function (data) {
        var err_code = data.err_code
        if (err_code === 0) {
          window.alert('修改密码成功！')
          window.location.href = '/login'
        }else if (err_code === 2) {
            window.alert(data.message)
        }else if (err_code === 1) {
            window.alert(data.message)
        }else if (err_code === 500) {
          window.alert('服务器忙，请稍后重试！')
        }
      }
    })
  })


  $(function(){
    $('#admin_setting_id').addClass('active')
    $('#profit_setting_id').removeClass('active')
})

