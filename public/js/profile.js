
//更新头像
$('#profile-avatar').on('change', function () {
  //当文件状态变化时执行这个事件处理函数，
  $('#upDateAvatar_from').trigger('submit')
})

//更新除头像以外信息
post_ajax('#upDateProfit_from','/settings/profile',function(){
  window.location.href = '/settings/profile'
})

//相应分类高亮
$(function () {
  $('#profit_setting_id').addClass('active').siblings().removeClass('active')
})