const Axion = {
  baseURL: "",
  headers: {},
  f: async function (path, options) {
    return await (await fetch(baseURL + path, options)).json();
  },
  get: async function (path, options) {
    return await this.f(path, { ...this.headers, ...options, method: "GET"});
  },

  post: async function (path, options) {
    return await this.f(path, { ...this.headers, ...options, method: "POST"});
  },

  update: async function (path, options) {
    return await this.f(path, { ...this.headers, ...options, method: "UPDATE"});
  },
}

export default Axion;