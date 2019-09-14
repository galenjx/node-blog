
// $('#profile-avatar').on('change',function(){
//     //当文件状态变化时执行这个事件处理函数，
    
//     var $this=$(this).val();
//     console.log($this)
//     $(this).siblings('input').val($this)
//     //打印一下#avatar的结构可以知道，上传文件的信息位置
//     // var files=$this.prop('files');
//     // if(!files.length) return
//     // var file=files[0];
    
    
//     // // console.dir(file.name);
//     // //FormData是h5新成员，专门配合ajax用于客户端与在服务端之间传输二进制数据
//     // var data=new FormData();
//     // //第一个为键，第二个为值
//     // data.append('avatar',file)
    
//     // var xhr=new XMLHttpRequest()
//     // xhr.open('POST','/avatar')
//     // xhr.send(data)
//     // xhr.onload=function(){
//     //   console.log(this.responseText)
//     // //   $this.siblings('img').attr('src',this.responseText)
//     // //   $this.siblings('input').val(this.responseText)
//     // }

//   })


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

  $(function(){
        $('#profit_setting_id').addClass('active')
        $('#admin_setting_id').removeClass('active')
  })