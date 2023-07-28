# 功能介绍

组件化的项目开发中，经常会需要在组件内部调用接口或处理函数来准备初始常量，比如请求一组固定的用户名信息供选择，当组件在同一页面被复用时，可能会重复地调用接口或函数，造成不必要的资源浪费。

单纯存取功能没有必要引入新的依赖，基本上状态管理功能都可以实现，之所以再写一个插件因为这部分功能的重点不在存取，而在于加载。

数据是异步获取的，无论如何存放都需要解决加载的问题，系统可能在多处需要该数据，同一页面也可能多处会去进行请求，存在一定的并发问题。

最简单的自然是在初始化的时候获取完数据，把异步变成同步，之后数据就存在内存当中，各处使用无需考虑额外问题。

但这样一方面会违背按需引入的设计理念，另一方面当数据需要重新获取的时候，为了保险只能刷新页面清空缓存，体验上并不好。

而此插件解决的则是这个并发问题，处处调用一处请求，之后通过事件告知各处请求完成可以使用，不需要再去考虑何时加载与并发加载造成多余请求的问题。

# 基本使用

```javascript
import Loader from '@xaios/data-loader'

// 实例化数据加载器，可选传入错误重试次数，默认为 0，出现错误不重试：new Loader(3)
const DataLoader = new Loader

// 在需要使用数据的地方引入数据加载方法
export function LoadData() {
  // 加载函数接收数据名与加载操作，取加载操作的返回值为该数据的值
  // 加载函数返回一个 Promise，会返回对应加载数据的值
  return DataLoader.Load('name', () => 'name')
}

// 可以直接接入返回 Promise 的请求方法（axios）
// GetData().then(data => {})
export function LoadAjax() {
  return DataLoader.Load('data', () => GetData())
}

// 也可以使用 async，同样取返回值
DataLoader.Load('name', async () => {})

// 可以通过 Get 方法获取数据内容
DataLoader.Get(name)

// 可以通过 Del 方法删除已加载的内容
DataLoader.Del(name)

// 可以通过 Clear 方法清空已加载的内容
DataLoader.Clear()

// 对象类型会返回 JSON.parse(JSON.stringify()) 处理的结果
```
