import axios from "axios";

export default class SC {
  constructor(options) {
    const defaultOptions = {
      config: {
        clientId: null
      }
    };
    this.options = {
      ...defaultOptions,
      ...options
    };
  }

  _checkConfig() {
    return new Boolean(this.options.config.clientId);
  }

  _doIfConfig(func) {
    if (this._checkConfig()) {
      func();
    } else {
      throw new Error("check config failed");
    }
  }

  init(o) {
    if (o.clientId) {
      this.options.config.clientId = o.clientId;
      return new SC(this.options);
    } else {
      throw new Error("no clientId provided");
    }
  }

  stream(trackId) {
    console.log(trackId);
    this._doIfConfig(() => {
      const url = `https://api.soundcloud.com/tracks/${trackId}/stream?client_id=${this.options.config.clientId}`;
      console.log(url);
      return new Promise((resolve, reject) => {
        axios
          .get(url)
          .then(res => {
            console.log(res);
            return resolve(res);
          })
          .catch(e => {
            return reject(new Error(e));
          });
      });
    });
  }

  // getTrack(trackId) {
  //   this._doIfConfig(() => {

  //     return new Promise((resolve, reject) => {

  //     })
  //   })
  // }
}
