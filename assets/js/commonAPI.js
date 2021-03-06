// 为全局的axios请求设置路径
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net'
    // 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // console.log('-----发送ajax请求前', config);
    // console.log(config.url);
    // 获取本地存储token令牌
    const token = localStorage.getItem('token') || ''
        // 在发送请求之前判断是否有/my开头的请求路径
        // 如果有，手动添加header请求头
        // 1. startsWith
        // 2.正则表达式
        // 3.indexOf('/my')==0
    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token
    }
    // 在发送请求之前做些什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);

});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // console.log('---发送ajax响应前', response);
    const { message, status } = response.data
    if (message == '身份认证失败！' && status == 1) {
        localStorage.removeItem('token')
        location.href = './login.html'
    }
    // 对响应数据做点什么
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});