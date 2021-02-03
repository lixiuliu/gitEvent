$(function() {
    // 解构赋值
    const { form, layer } = layui
    // 1.点击连接进行表单切换
    $('.link a').click(function() {
        $('.layui-form').toggle()
    })

    //表单验证
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        },
        pass: [
            /^\w{6,12}$/,
            '密码只能在6到12之间'
        ],
        samePass: function(value) { //表示表单值
            if (value !== $('#pass').val()) {
                return '两次密码不一致'
            }
        }
    })

    //注册功能
    $('.reg-form').submit(function(e) {
        // 提交form跳转的时候会显示页面跳转以及链接地址的后面会写自己输入的内容
        e.preventDefault()
        axios.post('/api/reguser', $(this).serialize()) //获取带name属性的
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('注册失败!')
                }
                // 自动跳转到登录
                layer.msg('注册成功!')
                $('.reg-form a').click()
            })
    })

    // 4.登录功能
    $('.login-form').submit(function(e) {
        e.preventDefault()
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败!')
                }
                // 登录成功后,首先把token(个人的身份凭证,令牌)保存在本地存储
                localStorage.setItem('token', res.token)
                layer.msg('登陆成功')
                    // 跳转页面
                location.href = './index.html'
            })
    })

})