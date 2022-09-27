import axios, { AxiosError, AxiosInstance } from 'axios';
import { message } from 'antd';
import { ServerCode, ServerCodeMap, rootURL } from './config';
import { RequestConfig, ResponseConfig, ResponseError } from './interface';

const service: AxiosInstance = axios.create({
  baseURL: rootURL,
  timeout: 200000, // 请求超时时间
  withCredentials: true, // 允许携带cookie
});

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error) => {
    //请求错误时做些事
    return Promise.reject(error);
  },
);

// response拦截器
service.interceptors.response.use(
  // HTTP的状态码(只有200才走这里)
  (response) => {
    const res = response.data;
    // 状态码为200时，表示请求成功不走错误处理流程
    if (+res.code === ServerCode.SUCCESS) return response.data;

    return Promise.reject({ data: res, response });
  },
  (err) => {
    // 统一错误拦截
    return Promise.reject(err);
  },
);
function isResponseError<R>(x: any): x is ResponseError<R> {
  return x.data;
}
function isAxiosError<R>(x: any): x is AxiosError<R> {
  return x.response;
}
// 错误处理
const errHandle: <R>(err: AxiosError<R> | ResponseError<R>) => Promise<R> = (
  err,
) => {
  // 判断上下文是“接口状态码”还是“HTTP状态码”
  let errResult = {};
  let code = -1;
  let errorMsg = '';

  // HTTP状态码出错
  if (isAxiosError(err) && err.response) {
    code = +err.response.status;
    errorMsg = ServerCodeMap[code];
  }

  // 接口状态码出错
  if (isResponseError(err)) {
    code = +err.data.code;
    errorMsg = err.data.msg || ServerCodeMap[code];
  }

  // 若code是400，则不会弹出message
  ![ServerCode.CACHE].includes(code)
    ? message.error(errorMsg)
    : console.error({ ...err, message: errorMsg });
  if (isResponseError(err)) {
    errResult = err.data;
  }

  // 未登录
  if (ServerCode.NO_LOGIN === code && window.location.pathname !== '/login') {
    const returnUrl =
      window.location.pathname === '/'
        ? ''
        : `?returnUrl=${window.location.pathname}`;
    window.location.href = `/login${returnUrl}`;
  }

  // 无权限
  if (ServerCode.FORBIDDEN == code) {
    window.location.replace('/403');
  }

  return Promise.reject(errResult);
};

const response: <R>(axiosObj: Promise<ResponseConfig<R>>) => Promise<R> = (
  axiosObj,
) => {
  return axiosObj.then((res) => res.data).catch((err) => errHandle(err));
};

/**
 * 四种请求方式
 * @param url       接口地址
 * @param data      接口参数（注：get后续将放入“含有params的对象”才能接到url；delete后续将放入“含有data属性的对象”才能通过payload传输）
 * @param config    接口所需其余配置参数
 */
export const get: <R>(req: RequestConfig) => Promise<R> = ({
  url,
  data,
  ...req
}) =>
  response(service.get(url, { params: { ...data, time: Date.now() }, ...req }));
export const post: <R>(req: RequestConfig) => Promise<R> = ({
  url,
  data,
  ...req
}) => response(service.post(url, data, { ...req }));
export const put: <R>(req: RequestConfig) => Promise<R> = ({
  url,
  data,
  ...req
}) => response(service.put(url, data, { ...req }));
export const del: <R>(req: RequestConfig) => Promise<R> = ({
  url,
  data,
  ...req
}) => response(service.delete(url, { data, ...req }));

export default service;
