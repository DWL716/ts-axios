import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders } from '../helpers/headers'
import { flattenHeaders } from '../helpers/util'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

// 处理 config的配置
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // 需要先处理 headers 原因是 后面 data 会被JSON序列化 这样就没法判断data是不是一个普通对象了
  // config.headers = transformHeaders(config)

  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 处理 url 请求拼接
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

/* // 处理 body 的data 数据
function transformRequestData(config: AxiosRequestConfig): any {
  // console.log(JSON.stringify(transformRequest(config.data)), '----');

  return transformRequest(config.data)
}

// 处理 headers 头
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config

  return processHeaders(headers, data)
} */

function transformResponseData(res: AxiosResponse): AxiosResponse {
  // 配置响应的转换
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

// 判断发送请求
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
