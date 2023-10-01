export default {
  set: (name, value) => {
    var val = JSON.stringify({value: value})
    return localStorage.setItem(name, val)
  },
  get: (name) => localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)).value : undefined,
  remove: (name) => localStorage.removeItem(name)
}
