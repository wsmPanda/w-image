<template>
  <div class="image-viewer-container" :class="className" @click="outClick">
    <img
      class="image-viewer-img"
      @mousedown="onDrag"
      @mouseup="onDragEnd"
      @mousemove="onMove"
      @click.stop
      :src="'file://' + data"
      :style="imageStyle"
    />
  </div>
</template>

<script>
export default {
  props: {
    data: String,
    full: Boolean
  },
  data() {
    return {
      scale: 1,
      top: 0,
      left: 0,
      draging: false,
      x: 0,
      y: 0
    };
  },
  computed: {
    className() {
      return {
        full: this.full,
        draging: this.draging
      };
    },
    imageStyle() {
      return {
        transform:
          this.full &&
          `translate(${this.left}px, ${this.top}px) scale(${this.scale})`
      };
    }
  },
  methods: {
    outClick() {
      this.draging = false;
      this.$emit("fullClose");
    },
    onDrag(e) {
      if (this.full) {
        this.draging = true;
        this.x = e.clientX;
        this.y = e.clientY;
        console.log(this.x, this.y);
      }
    },
    onDragEnd() {
      this.draging = false;
    },
    onMove(e) {
      if (this.draging) {
        this.top += e.movementY;
        this.left += e.movementX;
        this.y = this.top;
        this.x = this.left;
      }
    }
  }
};
</script>

<style lang="less">
.image-viewer-container {
  &.full {
    position: fixed;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.1);
    padding: 10%;
    cursor: grab;
  }
  img {
    user-select: none;
    -webkit-user-drag: none;
  }
}
</style>
