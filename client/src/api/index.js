import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8000'
});

const updateHeaders = (options) => {
    const userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    options = options ? options : {};
    let headers = options.headers ? options.headers : {};
    if(userInfo) {
        headers = Object.assign(headers, {"Authorization": `Bearer ${userInfo.access_token}`});
    }
    options.headers = headers;
    return options;
}

const get = (resourceUrl, options) => {
    return http.get(resourceUrl, updateHeaders(options));
}

const post = (resourceUrl, body, options) => {
    return http.post(resourceUrl, body, updateHeaders(options));
}

const put = (resourceUrl, body, options) => {
    return http.put(resourceUrl, body, updateHeaders(options));
}

const _delete = (resourceUrl, body, options) => {
    return http.delete(resourceUrl, body, updateHeaders(options));
}

export {get, post, _delete, put};