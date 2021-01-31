$(function() {

    let index;
    const { form } = layui
    getCateList()

    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取分类列表失败!')
            }
            // 1.4请求成功TODO
            // 使用模板引擎渲染页面：1.引入插件 2.准备一个模板3.调用一个函数
            const htmlStr = template('tpl', res)
                // console.log(htmlStr);
            $('tbody').empty()
            $('tbody').append(htmlStr)

        })
    }
    getCateList()
    $('.add-btn').click(function() {
            index = layer.open({
                type: 1,
                title: '添加文章分类',
                area: ['500px', '250px'],
                content: $('.add-from-container').html()
            });
        })
        // 3.监听添加表单的提交事件
        // 坑：注意这个表单点击之后再添加的，后创建的元素绑定事件统一使用"事件委托"
    $(document).on('submit', '.add-form', function(e) {
            e.preventDefault()
            axios.post('/my/article/addcates', $(this).serialize()).then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                layer.msg('添加成功')
                    // 成功TODO,关闭弹出层，index为定义弹出层位置的返回值
                layer.close(index)
                    // 更新外层分类表格数据，重新调用方法渲染即可
                getCateList()
            })
        })
        // 点击编辑按钮，弹出编辑表单
    $(document).on('click', '.edit-btn', function() {
            console.log(11);
            // 点击之后，显示一个弹出层
            index = layer.open({
                type: 1,
                title: '修改文章分类',
                area: ['500px', '250px'],
                content: $('.edit-from-container').html()
            });
            // 获取当前自定义属性
            // console.log($(this).data('id'));
            const id = $(this).data('id')
                // 发送请求，获取当前的分类数据
            axios.get(`/my/article/cates/${id}`).then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                // 对编辑表单进行赋值
                form.val('edit-form', res.data)

            })


        })
        //  监听编辑表单的提交事件
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault()
            // 发送请求到服务器，提交表单数据
        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            layer.msg('修改成功!')
            layer.close(index)
            getCateList()


        })
    })
})