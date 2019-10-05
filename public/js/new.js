
  post_ajax('#newPost_from','/posts/new',function(){
    window.alert('发表文章成功！')
    window.location.href = '/'
  })