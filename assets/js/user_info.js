$(function () {
    //自定义验证规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    // 用户渲染
    initUserInfo()
    //导出layer
    var layer = layui.layer
//封装函数
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //chenggonghouxuanran 成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }
    //重置表单
    $('#btnReset').on('click', function (e) {
        //阻止表单默认提交
        e.preventDefault();
        initUserInfo()
    })

    //4修改用户信息
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        //发送ajax,xiu修改用户信息
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('用户信息修改失败')
                }
                layer.msg('用户信息修改成功')
                //调用父页面的更新用户信息和头像方法
                window.parent.getUserInfo()
            }

        })
    })
})