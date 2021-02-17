<template>
  <div class="image-viewer">
    <div>
      <a @click="onNameClick">{{ data }}</a>
      <div>
        <!-- <Button @click="$main.cartAdd(data)">
          <Icon type="ios-add"/><Icon type="md-cart"
        /></Button> -->
        <Button @click.native="onDeleteClick">
          <Icon type="md-trash"></Icon>
        </Button>
        <span v-if="info">{{ sizeText }}</span>
      </div>
      <Button @click="onFullScreen" icon="md-expand" />
    </div>
    <iframe
      v-if="isPdf"
      :src="'file://' + data"
      type="application/pdf"
      width="100%"
      height="100%"
    />
    <Viewer
      v-else-if="isImage"
      :full="fullScreen"
      class="image-viewer-img"
      :data="data"
      @fullClose="fullScreen = false"
    />
    <VideoViewer
      v-else-if="videoViewerType !== 'ff'"
      :key="data"
      :data="data"
    ></VideoViewer>
    <VideoFFViewer v-else :key="data" :data="data"></VideoFFViewer>
  </div>
</template>

<script>
import { isImage, isPdf } from "render/util";
import VideoViewer from "../video-viewer/index";
import VideoFFViewer from "../video-viewer/ff";

import Viewer from "./viewer";
export default {
  inject: ["$main"],
  components: { VideoViewer, Viewer, VideoFFViewer },
  props: {
    data: {},
  },
  data() {
    return { info: null, fullScreen: false };
  },
  computed: {
    videoViewerType() {
      return (
        this.$main.config &&
        this.$main.config.video &&
        this.$main.config.video.player
      );
    },
    isImage() {
      return isImage(this.data);
    },
    isPdf() {
      return isPdf(this.data);
    },
    sizeText() {
      let text = "";
      let size = (this.info && this.info.size) || 0;
      let number = size;
      if (size <= 1024 * 1024) {
        number = size / 1024;
        text = "K";
      } else if (size <= 1024 * 1024 * 1024) {
        number = size / (1024 * 1024);
        text = "M";
      } else {
        number = size / (1024 * 1024 * 1024);
        text = "G";
      }
      return number.toFixed(2) + text;
    },
  },
  methods: {
    onFullScreen() {
      this.fullScreen = true;
    },
    onNameClick() {
      this.$connect.run("openDictory", { path: this.data });
    },
    onDeleteClick() {
      let path = this.data;
      this.data = null;
      this.$connect.run("deleteFile", { path });
    },
  },
  created() {
    this.$connect.run("getFileInfo", { path: this.data }).then((res) => {
      this.info = res;
    });
  },
};
</script>

<style lanag="less">
.image-viewer {
  padding: 8px;
}
.image-viewer-img {
  width: 100%;
  height: auto;
}
</style>
