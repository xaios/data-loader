module.exports = class {
  _data = {}
  _loading = {}
  _event_hub = {}

  constructor(count = 0) {
    this._count = count
  }

  Load(name, handle) {
    return new Promise((resolve, reject) => {
      if (this._data[name] !== undefined) return resolve(this._data[name])
      this.$on(`load_${name}`, resolve)
      this.$on(`warn_${name}`, e => {
        this._loading[name] = false
        reject(e)
      })

      if (this._loading[name]) return

      this._loading[name] = true
      this._Load(name, handle, this._count)
    })
  }

  async _Load(name, handle, count) {
    try {
      let result = handle()
      if (result instanceof Promise)
        result = await result

      this._data[name] = result
      this._loading[name] = false
      this.$emit(`load_${name}`, result)
    } catch(e) {
      count-- ? this._Load(name, handle, count) : this.$emit(`warn_${name}`, e)
    }
  }

  $on(name, handle) {
    this._event_hub[name] = this._event_hub[name] || []
    this._event_hub[name].push(handle)
  }

  $emit(name, ...params) {
    this._event_hub[name]?.forEach(handle => handle(...params))
  }
}
