
//========================================edit===========================================
post_ajax('#editPost_from', '/topic/edit', 'post', function () {
    window.alert('更改文章成功 yes！')
})

//========================================new===========================================

post_ajax('#newPost_from', '/posts/new', 'post', function () {
    window.alert('发表文章成功！')
    // window.location.href = '/'
})


//========================================delete===========================================

post_ajax('#delete_post', '/posts_delete_post', 'post', function(){
    window.alert('删除文章成功！！')
    window.location.href = '/settings/edit_post_list'
  },function(){
    var flag = window.confirm('确认需要删除您的文章吗')
    // if(!flag){
      return flag
    // }
  })