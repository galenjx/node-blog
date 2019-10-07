//========================================admin==========================================
//更新密码

var currentPathname = window.location.pathname

post_ajax('#upDateAdmin_from', '/settings/admin', function () {
  window.alert('修改密码成功！')
  window.location.href = '/login'
})
//删除账号
// post_ajax('#deleteAdmin_from','/settings/delete',function(){
//   window.alert('删除账号成功！！')
//   window.location.href = '/login'
// },function(){
//   var flag = window.confirm('确认需要删除您的账号吗')
//   if(!flag){
//     return window.alert('已停止删除账号操作！')
//     //为什么没有终止后面代码的执行？return false 后面再判断也不行
//   }
// })
post_ajax('#deleteAdmin_from', '/settings/delete', function () {
  window.alert('删除账号成功！！')
  window.location.href = '/login'
})


//========================================profit===========================================
//更新头像
$('#profile-avatar').on('change', function () {
  //当文件状态变化时执行这个事件处理函数，
  $('#upDateAvatar_from').trigger('submit')
})

//更新除头像以外信息
post_ajax('#upDateProfit_from', '/settings/profile',function(){
  window.alert('更新信息成功！')
})


//相应的分类高亮
$(function () {
  $("#setting_class a[href^='" + currentPathname + "']").addClass('active').siblings().removeClass('active')
})