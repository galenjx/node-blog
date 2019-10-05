
//更新密码
post_ajax('#upDateAdmin_from','/settings/admin',function(){
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
//     //为什么没有终止后面代码的执行？
//   }
// })


post_ajax('#deleteAdmin_from','/settings/delete',function(){
    window.alert('删除账号成功！！')
    window.location.href = '/login'
  })

//相应的分类高亮
$(function () {
    $('#admin_setting_id').addClass('active').siblings().removeClass('active')
  })

