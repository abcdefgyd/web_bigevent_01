$(function () {
    //1初始化分类
    var layer = layui.layer
    var form = layui.form

    //调用函数
    initCate()

    //封装函数
    function initCate() {
        $.ajax({
            method:'GET',
            url: '/my/article/cates',
            success: function (res) {
             //   console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //赋值，渲染form
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 2初始化富文本编辑器
    initEditor()

    // 3. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3。3. 初始化裁剪区域
    $image.cropper(options)

    //4dian点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //5设置图片
    $('#coverFile').change(function (e) {
        //拿到用户选择的文件
        var file = e.target.files[0]
        //非空校验url.createObjectUrl()参数不能为undefined\
        if (file == undefined) {
            return
        }
        //根据选择的文件，创建一个相对应的url地址
        var newImgURL = URL.createObjectUrl(file)
        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image.cropper('destory').attr('src', newImgURL).cropper(options)
    })

    //6设置状态、
    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    //7添加文章
    $('#form-pub').on('submit', function (e) {
        //组织默认提交
        e.preventDefault()
        //创建FormData对象，收集数据
        var fd = new FormData(this)
        //放入状态
        fd.append('state', state)
        //放入图片【ian
        $image.cropper('getCroppedCanvas', {
                //创建一个画布出来
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                //得到文件对象后，进行后修的操作
                fd.append('cover_img', blob)
                //发送ajax.yaozai要在toBlob函数里面
                publishArticle(fd)
            })
    })
    //封装添加文章的办法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                //失败的判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜你，发布文章成功')

                //tiaozhun跳转
                location.href = '/article/art_list.html'

                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                }, 1500)
            }
        })
    }

})