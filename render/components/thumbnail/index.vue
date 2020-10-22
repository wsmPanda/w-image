<template>
  <div class="thumbnail">
    <img v-if="isImage" class="thumbnail-img" :src="'file://' + src" />
    <video
      v-else
      class="thumbnail-img"
      controls="controls"
      preload="metadata"
      muted
    >
      <source :src="'file://' + src" />
    </video>
    <div v-if="showName" class="thumbnail-name" :title="name">{{ name }}</div>
    <Icon
      v-show="showCheck"
      @click.native.stop="onCheck"
      @dblclick.native.stop
      class="thumbnail-check"
      :type="this.check ? 'md-checkbox-outline' : 'md-square-outline'"
    />
  </div>
</template>

<script>
import { isImage, getSuffix } from "render/util";
export default {
  props: {
    src: String,
    showCheck: { type: Boolean, default: true },
    check: Boolean,
    showName: { type: Boolean, default: true }
  },
  data() {
    return {
      v: false
    };
  },
  computed: {
    name() {
      return this.src && this.src.split("/").pop();
    },
    isImage() {
      return isImage(this.src);
    },
    suffix() {
      return getSuffix(this.src);
    }
  },
  methods: {
    onCheck() {
      this.$emit("check", this.check);
    }
  }
};
</script>

<style lang="less">
.thumbnail {
  padding: 4px;
  padding-bottom: 30px;
  box-sizing: border-box;
  position: relative;
  user-select: none;
  video {
    pointer-events: none;
  }
  video::-webkit-media-controls-panel {
    display: none;
  }
}
.thumbnail-check {
  position: absolute;
  font-size: 18px;
  left: 8px;
  top: 8px;
  color: #2b85e4;
  cursor: pointer;
  opacity: 0.8;
}
.thumbnail-suffix {
  height: 100%;
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  font-family: sans-serif;
  color: #4654b1;
}
.thumbnail-img {
  object-fit: contain;
  height: 100%;
  user-select: none;
  width: 100%;
  margin-bottom: 30px;
  -webkit-user-drag: none;
}
.thumbnail-name {
  margin-top: -30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: center;
}
</style>
