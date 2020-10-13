export default class EventEmitter {
  constructor() {
    this.listeners = {};
    this.watcher = null;
  }
  emit(event, payload) {
    if (this.listeners[event] && this.listeners[event].length) {
      for (let listener of this.listeners[event]) {
        listener.call(this, payload);
      }
    }
    if (this.watcher) {
      this.watcher.call(this, { event, payload });
    }
  }
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return {
      off() {
        this.off(event, callback);
      }
    };
  }
  once(event, callback) {
    let onceCallback = (payload) => {
      callback.call(this, payload);
      this.off(onceCallback);
    };
    this.on(event, onceCallback);
  }
  off(event, callback) {
    if (this.listeners[event]) {
      if (callback) {
        this.listeners[event].splice(
          this.listeners[event].findIndex((item) => item === callback),
          1
        );
      } else {
        this.listeners[event] = [];
      }
    }
  }
  watch(callback) {
    this.watcher = callback;
  }
}
