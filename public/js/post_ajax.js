
  function post_ajax(formId,url,callback){
    $(formId).on('submit', function (e) {
        e.preventDefault()
        var formData = $(this).serialize()
        // console.log(formData)
        $.ajax({
          url: url,
          type: 'post',
          data: formData,
          dataType: 'json',
          success: function (data) {
            var err_code = data.err_code
            if (err_code === 0) {
              callback()
            }else if (err_code === 2) {
                window.alert(data.message)
            }else if (err_code === 1) {
              window.alert(data.message)
            }
          }
        })
      })
}


