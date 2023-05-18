import { fetch } from 'dva';
import qs from 'qs';
import { Message, notification } from 'antd';

const codeMessage = {
    0: '成功',
    100: '错误的请求',
    110: '必须为GET请求',
    120: '必须为POST请求',
    200: '没有权限',
    210: '未登录',
    300: '数据不正确',
    310: '不被识别的数据类型',
    311: '数据格式不正确',
    320: '表单数据不正确',
    330: '数据已存在',
    331: '电话号码已存在',
    340: '数据不存在',
    341: '电话号码不存在',
    350: '验证信息错误',
    351: '验证码不正确',
    400: '获取用户信息失败',
    410: '用户身份异常',
    411: '用户未激活',
    420: '登录失败',
    500: '客户端类型错误',
    600: '操作失败',
    610: '操作次数已达上限',
    700: '资源无效',
    710: '资源不存在',
    720: '资源已存在',
    730: '资源未改变',
    740: '资源已改变',
};

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: errortext,
    });
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
}

function parseJSON(response) {
    return response.json();
}

function urlEncode(arg) {
    const params = { ...arg };
    Object.keys(arg).forEach((key) => {
        if (
            arg[key] === '' ||
            arg[key] === null ||
            arg[key] === undefined ||
            (Array.isArray(arg[key]) && arg[key].length === 0) ||
            (typeof arg[key] === 'object' && arg[key].length === undefined)
        ) {
            delete params[key];
        }
    });
    return qs.stringify(params);
}

function formEncode(arg) {
    const params = { ...arg };
    Object.keys(arg).forEach((key) => {
        /* 过滤掉对象 */
        if (
            (arg[key] !== null && typeof arg[key] === 'object' && arg[key].length === undefined) ||
            arg[key] === undefined
        ) {
            delete params[key];
        }
        if (arg[key] === null) {
            params[key] = '';
        }
    });
    return qs.stringify(params);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [params] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request({
    url,
    method = 'GET',
    params,
    headers,
    body,
    doNotEncode = false,
}) {
    // 添加默认请求头
    const header = new Headers();

    // fetch默认不携带cookie，可以配置其credentials项，设为include时，cookie既可以同域发送，也可以跨域发送
    const options = {
        method,
        credentials: 'include',
        headers: header,
        crossDomain: true,
        // mode: 'no-cors',
    };

    if (options.method === 'POST' || options.method === 'PATCH' || options.method === 'PUT' || options.method === 'DELETE') {
        if (!headers) {
            options.headers.append('content-type', 'application/x-www-form-urlencoded');
        } else {
            options.headers.append('content-type', headers);
        }

        if (body) {
            options.body = body;
        } else if (params) {
            if (doNotEncode) {
                options.body = params;
            } else {
                options.body = formEncode(params);
            }
        } else {
            options.body = '';
        }
    }

    const path = method === 'GET' && params ? `${url}?${urlEncode(params)}` : url;

    return fetch(path, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
            return data
        })
        .catch((error) => {
            Message.warn('网络不稳定，请检查网络');
            throw error;
        });
}


