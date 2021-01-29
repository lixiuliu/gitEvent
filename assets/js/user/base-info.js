$(function() {
    const { layer, form } = layui

    // 1.页面一加载，获取用户信息
    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {
            // 校验请求失败
            if (res.status !== 0) {
                return layer.msg('获取失败')
            }
            const { data } = res
            // 给表单赋值
            // 注意：edit-userinfo是表单lay-filter属性的值
            // data对象中的属性名和表单name值一一对应
            form.val('edit-userinfo', data)
        })
    }
    initUserInfo()

    form.verify({
        nick: [
            /^\S{1,6}$/,
            '昵称长度必须在1~16个字符之间'
        ]
    })
    $('.base-info-form').submit(function(e) {
            e.preventDefault()
            axios.post('/my/userinfo', $(this).serialize())
                .then(res => {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('修改信息失败')
                    }
                    layer.msg('修改信息成功')
                        // 更新用户信息
                        // console.log(window.parent.document.querySelector('.nickname'));
                    window.parent.getUserInfo()
                })
        })
        // 重置功能
    $('#reset-btn').click(function(e) {
        e.preventDefault()
            // 重置渲染用户信息
        initUserInfo()
    })
})