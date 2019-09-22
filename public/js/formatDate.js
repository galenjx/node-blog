module.exports=function(dt){
    var year=dt.getFullYear()
      var month = dt.getMonth()+1
      var day = dt.getDate()
      var hour = dt.getHours()
      var min = dt.getMinutes()
      var sec = dt.getSeconds()
      return (`${ year }.${ month < 9 ? `0`+month : month }.${ day < 9 ? `0`+day : day } - ${ hour < 9 ? `0`+hour : hour }.${ min < 9 ? `0`+min : min }.${ sec < 9 ? `0`+sec : sec }`)
}