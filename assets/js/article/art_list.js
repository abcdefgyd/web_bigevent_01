$(function () {
    var layer = layui.layer
    var form = layui.form
    //din定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        //返回固定格式，格式化日期

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //1.DING定义提交参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的ID
        state: '', //文章的状态，可选择有：已发布。草稿
    }


    //2.chushihua初始化文章列表
    initTable()

    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl-table', res)
                $('tbody').html(str)

                //调用分页
                renderPage(res.total)
            }
        })
    }

    //3初始化分类

    initCate()
    //封装
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                //校验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    //4筛选功能
    $('#form-search').on('submit', function (e) {
        //组织表单默认事件提交
        e.preventDefault()
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        //赋值
        q.state = state
        q.cate_id = cate_id
        //初始化文章列表
        initTable()
    })

    //5fenye分页
    var laypage = layui.laypage

    function renderPage(total) {
        // alert(total)
        //开启location.hash的记录
        laypage.render({
            elem: 'pageBox', //test1是ID
            count: total, //数据总数
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //第几页

            //分页模块设置，显示了哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //每页显示多少条数据的选择器
            limits: [2, 3, 5, 10],

            jump: function (obj, first) {

                //obj包含了当前分页的所有参数
                console.log(first, obj.curr, obj.limit);
                //obj所有参数所在的对象
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                //判断，不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    //initTable初始化文章列表
                    initTable()
                }

            }
        });
    }

    //6shanchu删除
    var layer = layui.layer
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        //显示对话框
        //显示对话框
        layer.confirm('是否确认删除？', {
                icon: 3,
                title: '提示'
            },
            function (index) {
                $.ajax({
                    url: '/my/article/delete/' + Id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }

                        layer.msg('恭喜您，文章删除删除成功')
                        //页面汇总删除按钮个数等于1，页码大于1
                        if ($('.btn-delete').length == 1 && q.pagenum > 1) {
                            q.pagenum--
                        }
                        //因为我们更新成功了，所以要重新渲染页面中的数据
                        initTable()
                    }
                })
                layer.close(index)
            })

    })
})