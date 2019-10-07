
//========================================edit===========================================
post_ajax('#editPost_from', '/topic/edit', function () {
    window.alert('更改文章成功 yes！')
})

//========================================new===========================================

post_ajax('#newPost_from', '/posts/new', function () {
    window.alert('发表文章成功！')
    // window.location.href = '/'
})