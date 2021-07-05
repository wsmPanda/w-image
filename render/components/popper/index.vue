<template>
  <div v-show="currentValue" class="popper" :style="style">
    <slot></slot>
  </div>
</template>

<script>
// land dom转移到的位置 parent dom定位位置
import util from "render/util/dom";
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    tranfer: {
      type: Boolean,
      default: true
    },
    theme: String,
    offsetTop: {
      type: Number,
      default: 0
    },
    offsetLeft: {
      type: Number,
      default: 0
    },
    cliclOutClose: {
      type: Boolean,
      default: true
    },
    land: {},
    landContain: {
      type: Boolean,
      default: false
    },
    x: {
      // left start center end right full
      type: String,
      default: "left"
    },
    y: {
      // top start center end bottom full
      type: String,
      default: "bottom"
    }
  },
  data() {
    return {
      active: this.value,
      currentValue: this.value,
      pos: {
        top: 0,
        left: 0
      },
      mousePos: {
        top: 0,
        left: 0
      },
      mouseMode: false
    };
  },
  computed: {
    style() {
      let pos = this.pos;
      return {
        top: pos.top + "px",
        left: pos.left + "px",
        width: !pos.width ? null : pos.width + "px",
        height: !pos.height ? null : pos.height + "px"
      };
    }
  },
  watch: {
    value(v) {
      if (this.currentValue !== v) {
        if (v) {
          this.open();
        } else {
          this.close();
        }
      }
    },
    currentValue(v) {
      if (this.value !== v) {
        this.$emit("input", v);
      }
    },
    land(v) {
      this.bindLand(v);
      this.updatePosition();
    }
  },
  methods: {
    close() {
      this.currentValue = false;
      this.mouseMode = false;
      this.unbindScroll();
      this.unbindClickOut();
    },
    open() {
      this.currentValue = true;
      this.bindScroll();
      this.bindClickOut();
      this.updatePosition();
    },
    setParent(v) {
      this.parentNode = v;
      this.bindParent();
    },
    bindScroll() {
      this.scrollBinding = util.bindScroll(
        this.parentNode,
        this.landNode,
        this.onParentScroll
      );
    },
    unbindScroll() {
      if (this.scrollBinding) {
        this.scrollBinding();
      }
    },
    onParentScroll() {
      this.updatePosition();
    },
    bindClickOut() {
      setTimeout(() => {
        document.addEventListener("click", this.onClickOut);
      });
    },
    unbindClickOut() {
      document.removeEventListener("click", this.onClickOut);
    },
    onClickOut(e) {
      let target = e.target;
      if (this.$el.contains(target)) {
        return false;
      }
      if (this.cliclOutClose) {
        this.close();
      }
      this.$emit("click-out");
    },
    setPosition() {
      this.updatePosition();
    },
    setPositionMouse(e) {
      let pos = util.getRelativePostion(
        this.landNode || document.body,
        this.landNode || document.body
      );
      this.mousePos.top = e.pageY - pos.top;
      this.mousePos.left = e.pageX - pos.left;
      this.mouseMode = true;
      e.preventDefault();
      this.open();
      return false;
    },
    bindParent() {
      this.updatePosition();
    },
    getPosition() {
      if (this.mouseMode) {
        return this.mousePos;
      } else {
        return util.getRelativePostion(
          this.parentNode || this.$el.parentNode || this.$el,
          this.landNode || document.body
        );
      }
    },
    updatePosition() {
      this.pos.width = null;
      this.pos.height = null;
      this.$nextTick(() => {
        let pos = this.getPosition();
        pos.width = null;
        pos.height = null;
        if (this.$el && !this.mouseMode) {
          switch (this.x) {
            case "left":
              pos.left -= this.$el.offsetWidth;
              break;
            case "start":
              break;
            case "center":
              pos.left +=
                this.$el.offsetWidth / 2 - this.parentNode.offsetWidth / 2;
              break;
            case "end":
              pos.left += this.parentNode.offsetWidth - this.$el.offsetWidth;
              break;
            case "right":
              pos.left += this.parentNode.offsetWidth;
              break;
            case "full":
              pos.width = this.parentNode.offsetWidth;
              break;
          }
          switch (this.y) {
            case "top":
              pos.top -= this.$el.offsetHeight;
              break;
            case "start":
              break;
            case "center":
              pos.top +=
                this.$el.offsetHeight / 2 - this.parentNode.offsetHeight / 2;
              break;
            case "end":
              pos.top += this.parentNode.offsetHeight - this.$el.offsetHeight;
              break;
            case "bottom":
              pos.top += this.parentNode.offsetHeight;
              break;
            case "full":
              pos.height = this.parentNode.offsetHeight;
              break;
          }
        }
        this.checkContain();
        this.pos = pos;
      });
    },
    checkContain() {
      this.$nextTick(() => {
        let pos = this.pos;
        if (this.landContain) {
          if (this.landNode.offsetWidth < pos.left + this.$el.offsetWidth) {
            pos.left -=
              pos.left + this.$el.offsetWidth - this.landNode.offsetWidth;
          } else if (pos.left < 0) {
            pos.left = 0;
          }

          if (this.landNode.offsetHeight < pos.top + this.$el.offsetHeight) {
            pos.top -=
              pos.top + this.$el.offsetHeight - this.landNode.offsetHeight;
          } else if (pos.top < 0) {
            pos.top = 0;
          }
        }
      });
    },
    bindLand(node) {
      let el = this.$el;
      this.landNode =
        (node instanceof window.Node ? node : document.querySelector(node)) ||
        document.body;

      let parentNode = el.parentNode;
      if (!parentNode) return;
      const home = document.createComment("");
      let hasMovedOut = false;

      if (this.transfer !== false) {
        parentNode.replaceChild(home, el);
        this.landNode.appendChild(el);
        hasMovedOut = true;
        this.parentNode = parentNode;
      }
      if (!el.__transferDomData) {
        el.__transferDomData = {
          parentNode: parentNode,
          home: home,
          target: this.landNode,
          hasMovedOut: hasMovedOut
        };
      }
    }
  },
  destroyed() {
    this.unbindClickOut();
    this.unbindScroll();
  },
  mounted() {
    this.bindLand(this.land);
  },
  created() {}
};
</script>

<style lang="less">
.popper {
  z-index: 10;
  position: absolute;
  background: #fafafa;
  border: 1px solid #eee;
  padding: 4px;
}
</style>
