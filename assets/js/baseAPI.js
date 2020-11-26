var baseURL='http://ajax.frontend.itheima.net'
// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = baseURL + options.url

  //对需要权限的接口设置配置信息,必须以my开头的
  if(options.url.indexOf('/my/')!==-1){
    options.headers={
      Authorization: localStorage.getItem('token') || ''
    }
  }
//拦截所有响应，判断身份认证信息
  options.complete=function(res){
    var obj=res.responseJSON
    if(obj.status==1&&obj.message=='身份认证失败！'){
    //1清空本地token
    localStorage.removeItem('token')
    //2页面跳转
    location.href='/login.html'

    }
  }
})
