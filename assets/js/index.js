$(function () {
    //1获取用户信息
    getUserInfo()

    //2退出
    $('#logOut').on('click', function () {
        layer.confirm('是否确认退出?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            //三件事，清除本地token;跳转页面；关闭询问框
            localStorage.removeItem('token')
            //跳转
            location.href = '/login.html'
            //关闭询问框
            layer.close(index);
        });
    })
});
//获取用户信息，封装到入口函数的外面，后面的页面要调用v这个函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调用renderAvatar渲染用户的头像v
            renderAvatar(res.data)
            // console.log(res);
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    //1获取用户的信息
    var name = user.nickname || user.username
    //2设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3按照需要渲染用户的头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}