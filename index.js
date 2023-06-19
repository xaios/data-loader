module.exports = class {
  _data = {}
  _loading = {}
  _event_hub = {}

  constructor(count = 0) {
    this._count = count
  }

  Load(name, handle) {
    return new Promise((resolve, reject) => {
      if (this._data[name] !== undefined) return resolve(this.Get(name))
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
      this.$emit(`load_${name}`, this.Get(name))
    } catch(e) {
      count-- ? this._Load(name, handle, count) : this.$emit(`warn_${name}`, e)
    }
  }

  Get(name) {
    return typeof this._data[name] === 'object' ? JSON.parse(JSON.stringify(this._data[name])) : this._data[name]
  }

  Del(name) {
    delete this._data[name]
  }

  $on(name, handle) {
    this._event_hub[name] = this._event_hub[name] || []
    this._event_hub[name].push(handle)
  }

  $emit(name, ...params) {
    this._event_hub[name]?.forEach(handle => handle(...params))
  }
}
