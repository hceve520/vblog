import axios from 'axios'
import axiosCancel from 'axios-cancel'

axiosCancel(axios, {
    debug: false
})

const get = async(url, params = {}, headers) => {
    axios.cancel(url)

    Object.keys(params).map(item => {
        params[item] = decodeURIComponent(params[item])
    })

    try {
        let options = {
            method: 'get',
            url,
            noCache: true,
            params: params,
            timeout: 30000,
            headers
        }

        options.requestId = url
        const response = await axios(options)
        console.log(response.data)
        return response.data
    } catch (err) {
        return {
            isError: true,
            statusCode: -10001,
            message: err.response.data.message,
            data: null
        }
    }
}

const post = async(url, params) => {
    axios.cancel(url)

    params = params || {}
        // 所有Post请求加上用户信息
    params.user = window.userInfo

    try {
        const response = await axios({
            url,
            method: 'post',
            data: params,
            requestId: url,
            timeout: 30000,
            headers: {
                'x-csrf-token': CSRF_TOKEN,
                'access-control-allow-origin': '*'//这里的access-control-allow-origin可以用来解决跨域问题,
            }
        })
        return response.data
    } catch (err) {
        return {
            isError: true,
            statusCode: -10001,
            message: '接口异常',
            data: null
        }
    }
}

export default {
    get,
    post
}