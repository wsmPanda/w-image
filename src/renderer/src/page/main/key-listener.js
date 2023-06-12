export default {
  methods: {
    addListenerKeyup(v, cb) {
      this.keyListeners.set(v, cb);
      v.$on("keyListenerFocus", () => {
        this.focisItem = v;
      });
    },
    removeListenerKeyup(v) {
      this.keyListeners.delete(v);
      if (this.focisItem === v) {
        this.focisItem = null;
      }
    }
  },
  beforeMount() {
    this.keyListeners = new Map();
    window.addEventListener("keyup", (e) => {
      if (this.focisItem && this.keyListeners.has(this.focisItem)) {
        let cb = this.keyListeners.get(this.focisItem);
        if (
          this.focisItem.$el &&
          this.focisItem.$el.offsetHeight &&
          e.target === document.body
        ) {
          cb(e);
        }
      }
    });
  }
};
