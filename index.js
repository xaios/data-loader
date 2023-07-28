const EVENT = {}
const DOING = {}
const STORE = {}

module.exports = class {
  constructor(time = 0) {
    this.retry = time
  }

  Load(name, handle) {
    return new Promise((resolve, reject) => {
      if (STORE[name] !== undefined) return resolve(this.Get(name))

      this.$on(`load_${name}`, () => {
        DOING[name] = false
        resolve(this.Get(name))
      })
      this.$on(`warn_${name}`, e => {
        DOING[name] = false
        reject(e)
      })

      if (DOING[name]) return
      DOING[name] = true
      this.LoadData(name, handle, this.retry)
    })
  }

  async LoadData(name, handle, retry) {
    try {
      STORE[name] = await handle()
      this.$emit(`load_${name}`)
    } catch(e) {
      retry-- ? this.LoadData(name, handle, retry) : this.$emit(`warn_${name}`, e)
    }
  }

  Get(name) {
    return typeof STORE[name] === 'object' ? JSON.parse(JSON.stringify(STORE[name])) : STORE[name]
  }

  Del(name) {
    delete STORE[name]
  }

  Clear() {
    Object.keys(STORE).forEach(i => this.Del(i))
  }

  $on(name, handle) {
    EVENT[name] = EVENT[name] || []
    EVENT[name].push(handle)
  }

  $emit(name, ...params) {
    EVENT[name]?.forEach(handle => handle(...params))
  }
}
