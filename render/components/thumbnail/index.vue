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
      <source :src="'file://' + src"/>
    </video>
    <div v-if="showName" class="thumbnail-name" :title="name">{{ name }}</div>
  </div>
</template>

<script>
import { isImage, getSuffix } from "render/util";
export default {
  props: { src: String, showName: { type: Boolean, default: true } },
  computed: {
    name() {
      return this.src && this.src.split("/").pop();
    },
    isImage() {
      return isImage(this.src);
    },
    suffix() {
      return getSuffix(this.src);
    },
  },
};
</script>

<style lang="less">
.thumbnail {
  padding: 4px;
  padding-bottom: 30px;
  box-sizing: border-box;
  video {
    pointer-events: none;
  }
  video::-webkit-media-controls-panel {
    display: none;
  }
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
  width: 100%;
  margin-bottom: 30px;
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
