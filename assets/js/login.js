$(function() {
    // 解构赋值
    const { form, layer } = layui
    // 1.点击连接进行表单切换
    $('.link a').click(function() {
        $('.layui-form').toggle()
    })
    form.verify({
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
    $('.reg-form').submit(function(e) {
        e.preventDefault()
        axios.post('/api/reguser', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('注册失败!')
                }
                // 自动跳转到登录
                layer.msg('注册成功!')
                $('.login-form a').click()
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