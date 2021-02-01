$(function() {
    const { form, laypage } = layui
    getCateList()

    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败')
            }
            //遍历数组 渲染下拉组件的选项
            res.data.forEach(item => {
                    // 每遍历一次向下拉选择框中追加一条option
                    $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>
            `)
                })
                // 1.5这里是个小坑：动态创建的表单元素需要手动更新表单
            form.render('select');
        })
    }
    // 定义一个查询对象
    const query = {
        pagenum: 1, //表示当前的页码值，第几页
        pagesize: 2, //表示每页显示的数据条数
        cate_id: '', //表示文章的分类
        state: '' //表示文章的状态
    }
    renderTable()
        // 发送请求到服务器，获取文章列表数据
    function renderTable() {
        // 3.1发送请求
        axios.get('/my/article/list', {
            params: query
        }).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败')
            }
            // 3.2使用模板引擎来渲染
            const htmlStr = template('tpl', res)
                // console.log(htmlStr);
                // 3.3添加到tbody中
            $('tbody').html(htmlStr)

            renderPage(res.total)
        })
    }
    // 4.把服务端获取的数据，渲染成分页器
    function renderPage(total) {
        laypage.render({
            elem: 'pagination', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize, //每页显示的数量
            limits: [2, 3, 4, 5], //每页的数据条数
            curr: query.pagenum, //当前的页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器的布局排版
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                // 4.2修改查询对象的参数
                query.pagenum = obj.curr
                query.pagesize = obj.limit
                    //首次不执行
                if (!first) {
                    // 4.3非首次进入页面，需要重新渲染表格数据
                    renderTable()
                }
            }
        });
    }
    // 5表单筛选功能
    $('.layui-form').submit(function(e) {
            e.preventDefault()
            const cate_id = $('#cate-sel').val()
            const state = $('#state').val()
            console.log(cate_id, state);
            // 5.2把获取到的值重新赋值给query对象
            query.cate_id = cate_id
            query.state = state
                // 5.3重新调用renderTable
            renderTable()
        })
        // 6.点击删除按钮，删除当前的文章
        // 点击删除按钮
    $(document).on('click', '.del-btn', function() {
        const id = $(this).data('id')
        console.log(id);
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            axios.get(`/my/article/delete/${id}`).then(res => {
                if (res.status !== 0) {
                    return layer.msg('删除失败')
                }
                // 提示成功
                layer.msg('删除成功')
                    // 填坑处理：当前页只有一条数据且不处在第一页的时候，那么我们点击删除这个数据之后，应该手动更新上一页的数据

                if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                    query.pagenum = query.pagenum - 1
                }
                renderTable()
            })
            layer.close(index);
        });

    })
})