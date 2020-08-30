import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders } from '../helpers/headers'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

// 处理 config的配置
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // 需要先处理 headers 原因是 后面 data 会被JSON序列化 这样就没法判断data是不是一个普通对象了
  config.headers = transformHeaders(config)

  config.data = transformData(config)
}

// 处理 url 请求拼接
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

// 处理 body 的data 数据
function transformData(config: AxiosRequestConfig): any {
  // console.log(JSON.stringify(transformRequest(config.data)), '----');

  return transformRequest(config.data)
}

// 处理 headers 头
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config

  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}
