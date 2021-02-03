$(function() {
    // 提取组件
    const { form } = layui
    let state = ''
        // 接收列表传来的查询参数
    console.log(location.search);
    // 获取查询参数中的id值
    const arr = location.search.slice(1).split('=')
    const id = arr[1]
    console.log(arr[1]);
    // 发送请求到服务器，获取当前这条id的文章详情
    function getArtDetail(id) {
        axios.get(`/my/article/${id}`).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败')
            }
            // 给form表单赋值数据
            form.val('edit-form', res.data)
                // 初始化富文本编辑器
            initEditor()
                //替换裁剪区中的封面图片
            $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
        })
    }
    getArtDetail(id)

    // 1.从服务器获取文章的分类列表
    getCateList()

    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            // console.log(res);
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
            // 在获取分类列表成功之后,再去调用获取文章详情的函数
            getArtDetail(id)
        })
    }
    // 2.初始化富文本编辑器
    initEditor()

    // 3.先获取裁剪的图片
    const $image = $('#image')

    // 初始化裁剪区域 cropper()
    $image.cropper({
        // 指定的长度比
        aspectRatio: 400 / 280,
        // 指定预览区，提供元素的选择器
        preview: '.img-preview'
    })
    $('#choose-btn').click(function() {
            $('#file').click()
        })
        // 6.给文件选择框绑定change事件
    $('#file').change(function() {
            // 6.1获取所以文件列表
            console.log(this.files);
            // 把文件转成blob格式的url
            const imgUrl = URL.createObjectURL(this.files[0])
                // 替换掉裁剪区的图片
            $image.cropper('replace', imgUrl)
        })
        // 监听表单的提交事件（点击发布或存为草稿）
    $('.publish-form').submit(function(e) {
            e.preventDefault()
                // 7.1获取表单中所有的内容=>new FormData(原生表元素)
                // const fd = new FormData(this)
                // FormData相关方法： append() set() get() forEach()
                // 7.2检测formdata中的数据项是否获取成功
            fd.forEach(item => {
                    console.log(item);
                })
                // 7.3向fd中新增state数据
            fd.append('state', state)
                // 7.4获取裁剪封面图片的二进制数据
            $image.cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            }).toBlob(blob => {
                // 坑：获取富文本编辑器中最新内容的操作，要放在异步回调函数中，负责拿不到最新的内容
                const fd = new FormData(this)
                    // 向fd中新增state文章状态数据
                fd.append('state', state)
                    // console.log(blob); //二进制图片数据添加到formdata中
                fd.append('cover_img', blob)
                    // 7.6TODO发送请求，提交数据到服务器
                publishArticle(fd)
            })
        })
        // 8.点击发布和存为草稿按钮，改变state状态栏
    $('.last-row button').click(function() {
            console.log($(this).data('state'));
            state = $(this).data('state')
        })
        // 9.在外层封装一个发布文章请求的函数，参数就是组装好的formdata数据
    function publishArticle(fd) {
        // 发送之前，我们想formdata数据中添加一条id数据
        fd.append('Id', id)
            // 发送请求
        axios.post('/my/article/edit', fd).then(res => {
            console.log(res);
            // 9.1判断请求失败
            if (res.status !== 0) {
                return layer.msg('发布失败')
            }
            layer.msg(state == '草稿' ? '保存草稿成功' : '编辑文章成功')
                // TODO：跳转到文章列表里
            location.href = './list.html'
                // 左边的导航条进行更新
            window.parent.$('.layui-this').prev().find('a').click()
        })
    }
})