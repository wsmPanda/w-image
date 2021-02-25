<template>
  <div class="image-viewer">
    <div>
      <a @click="onNameClick">{{ data }}</a>
      <div class="file-info">
        <Button
          v-if="isImage"
          class="file-expand"
          @click="onFullScreen"
          icon="md-expand"
          size="small"
        />
        <div class="file-state">
          <!-- <Button @click="$main.cartAdd(data)">
          <Icon type="ios-add"/><Icon type="md-cart"
        /></Button> -->
          <span v-if="info">{{ sizeText }}</span>
        </div>
        <Button @click.native="onDeleteClick" size="small">
          <Icon type="md-trash"></Icon>
        </Button>
      </div>
    </div>
    <PdfViewer v-if="isPdf" :src="data" />
    <Viewer
      v-else-if="isImage"
      :full="fullScreen"
      class="image-viewer-img"
      :data="data"
      @fullClose="fullScreen = false"
    />
    <template v-else-if="isVideo">
      <VideoViewer
        v-if="videoViewerType !== 'ff'"
        :key="data"
        :data="data"
      ></VideoViewer>
      <VideoFFViewer v-else :key="data" :data="data"></VideoFFViewer
    ></template>
  </div>
</template>

<script>
import { isImage, isPdf, isVideo } from "render/util";
import VideoViewer from "../video-viewer/index";
import VideoFFViewer from "../video-viewer/ff";
import PdfViewer from "../pdf-viewer";
import Viewer from "./viewer";
export default {
  inject: ["$main"],
  components: { VideoViewer, Viewer, VideoFFViewer, PdfViewer },
  props: {
    data: {}
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
    isVideo() {
      return isVideo(this.data);
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
    }
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
      setTimeout(() => {
        this.$connect.run("deleteFile", { path });
      });
    }
  },
  created() {
    this.$connect.run("getFileInfo", { path: this.data }).then((res) => {
      this.info = res;
    });
  }
};
</script>

<style lang="less">
.image-viewer {
  padding: 8px;
}
.image-viewer-img {
  width: 100%;
  height: auto;
}
.file-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  .file-state {
    flex: 1;
  }
  .file-expand {
    margin-right: 8px;
  }
}
</style>
