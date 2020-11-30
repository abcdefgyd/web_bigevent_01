$(function () {

            //调用初始化文章函数
            initArtCateList()

            //封装函数
            function initArtCateList() {
                //发送ajax请求
                $.ajax({
                    url: '/my/article/cates',
                    success: function (res) {
                        console.log(res);
                        var htmlStr = template('tpl-cate-list', res)
                        $('tbody').html(htmlStr)
                    }
                })
            }

            //显示添加文章分类列表、
            var layer = layui.layer


            $('#btnAdd').on('click', function () {
                //2利用框架代码，显示添加文章显示区域
                indexAdd = layer.open({
                    type: 1,
                    title: '添加文章分类',
                    area: ['500px', '260px'],
                    content: $('#dialog-add').html()
                })
            })
            var indexAdd = null
            //3提交文章分类添加
            $('body').on('submit', '#form-add', function (e) {
                e.preventDefault()
                //发送ajax请求
                $.ajax({
                    method: 'post',
                    url: '/my/article/addcates',
                    data: $(this).serialize(),
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        initArtCateList()
                        layer.msg('恭喜您，新增文章分类成功')
                        layer.close(indexAdd)
                    }
                })
            })

            //4修改展示表单
            var indexEdit = null
            var form = layui.form
            $('tbody').on('click', '.btn-edit', function () {
                indexEdit = layer.open({
                    type: 1,
                    title: '修改文章分类',
                    area: ['500px', '260px'],
                    content: $('#dialog-edit').html()
                })
                //获取id，发送ajax获取数据，渲染到页面
                var Id = $(this).attr('data-id')
                $.ajax({
                    url: '/my/article/cates/' + Id,
                    success: function (res) {
                        form.val('form-edit', res.data)
                    }
                })
            })
            //4修改提交
            $('body').on('submit', '#form-edit', function (e) {
                e.preventDefault()
                //发送ajax请求
                $.ajax({
                    method: 'post',
                    url: '/my/article/updatecate',
                    data: $(this).serialize(),
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        initArtCateList()
                        layer.msg('恭喜您，新增文章更新成功')
                        layer.close(indexEdit)
                    }
                })
            })


            //删除
            $('tbody').on('click', '.btn-delete', function () {
                    //获取id，发送ajax获取数据，渲染到页面
                    var Id = $(this).attr('data-id')
                    //显示对话框
                    layer.confirm('是否确认删除？', {
                            icon: 3,
                            title: '提示'
                        },
                        function (index) {
                            $.ajax({
                                url: '/my/article/deletecate/' + Id,
                                success: function (res) {
                                    if (res.status !== 0) {
                                        return layer.msg(res.message)
                                    }

                                    layer.msg('恭喜您，文章类别删除成功')
                                    layer.close(index)
                                    initArtCateList()
                                }
                            })
                        })

                    })
            })