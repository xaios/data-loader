# 功能介绍

组件化的项目开发中，经常会需要在组件内部调用接口或处理函数来准备初始常量，比如请求一组固定的用户名信息供选择，当组件在同一页面被复用时，可能会重复地调用接口或函数，造成不必要的资源浪费。

这类处理也可以放在公共函数中，再经由相关 getter 在组件中引用，但这破坏了组件化的设计，不利于逻辑的分离，维护起来会比较麻烦。

如果把操作放回组件内，就需要考虑页面上多个组件间数据加载与共享的问题，需要一点小小的设计来实现。

# 基本使用

```javascript
import Loader from '@xaios/data-loader'

// 实例化数据加载器，可选传入错误重试次数，默认为 0，出现错误不重试：new Loader(3)
// 需要在 export 前实例化对象，此时定义的数据将被所有组件共享
const DataLoader = new Loader

export default {
  // 进一步节流，只在组件被挂载后才开始加载数据
  mounted() {
    // 加载函数接收数据名与加载操作，取加载操作的返回值为该数据的值
    // 加载函数返回一个 Promise，data 为对应加载数据的值
    DataLoader.Load('name', () => 'name').then(data => {}).catch(e => {})

    // 举个例子，GetData 是一个返回 Promise 的请求方法（axios），可以如此改造
    // GetData().then(data => {})
    //
    // DataLoader.Load('api', () => GetData()).then(data => {
    //   这里返回的 data 与前面的 data 相同，但不会重复发起请求
    // })

    // 加载操作可以返回 Promise，此时取 resolve 的内容为数据值
    // DataLoader.Load('name', () => new Promise)

    // 也可以使用 async，同样取返回值
    // DataLoader.Load('name', async () => {})

    // 可以通过 Get 方法获取数据内容
    // DataLoader.Get(name)

    // 对象类型会返回 JSON.parse(JSON.stringify()) 处理的结果，如果需要原始数据，可以直接读内置对象
    // DataLoader._data[name]
  }
}
```

# 事件监听

```javascript
// 内部监听的事件，一般不需要用到
DataLoader.$on(`load_${name}`, data => {
  // data       // 对应数据的加载结果
})

// 内部监听的事件，一般不需要用到
DataLoader.$on(`warn_${name}`, e => {
  // e          // 对应数据的加载错误信息
})

// 也支持自定义事件触发与监听
// this.handle_process.$emit('', ...params)
```
