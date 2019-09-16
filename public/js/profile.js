
//更新头像
$('#profile-avatar').on('change',function(){
    //当文件状态变化时执行这个事件处理函数，
    $('#upDateAvatar_from').trigger('submit')
  })


//更新除头像以外信息
$('#upDateProfit_from').on('submit', function (e) {
    e.preventDefault()
    var formData = $(this).serialize()
    // console.log(formData)
    $.ajax({
      url: '/settings/profile',
      type: 'post',
      data: formData,
      dataType: 'json',
      success: function (data) {
        var err_code = data.err_code
        if (err_code === 0) {
          window.location.href = '/settings/profile'
        }else if (err_code === 500) {
          window.alert('服务器忙，请稍后重试！')
        }
      }
    })
  })


  //样式切换
  $(function(){
        $('#profit_setting_id').addClass('active')
        $('#admin_setting_id').removeClass('active')
  })