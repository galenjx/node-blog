
function post_ajax(formId, url, type, successCallback, advanceCallback) {
  $(formId).on('submit', function (e) {
    e.preventDefault()
    if(advanceCallback && !advanceCallback())
    return window.alert('已停止操作')
    var formData = $(this).serialize()
    console.log(formData)
     $.ajax({
      url: url,
      type: type,
      data: formData,
      dataType: 'json',
      success: function (data) {
        var err_code = data.err_code
        if (err_code === 0) {
          successCallback && successCallback()
        } else if (err_code === 2) {
          window.alert(data.message)
        } else if (err_code === 1) {
          window.alert(data.message)
        }
      }
    })
  })
}



