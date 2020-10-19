<template>
  <div class="image-viewer">
    <img v-if="isImage" class="image-viewer-img" :src="'file://' + data" />
    <VideoViewer v-else :key="data" :data="data"></VideoViewer>
    <div>
      <a @click="onNameClick">{{ data }}</a>
      <div>
        <Button @click="$main.cartAdd(data)">
          <Icon type="ios-add"/><Icon type="md-cart"
        /></Button>
        <Button @click.native="onDeleteClick">
          <Icon type="md-trash"></Icon>
        </Button>
      </div>

      <div v-if="info">{{ sizeText }}</div>
    </div>
  </div>
</template>

<script>
import { isImage } from "render/util";
import VideoViewer from "../video-viewer";
export default {
  inject: ["$main"],
  components: { VideoViewer },
  props: {
    data: {}
  },
  data() {
    return { info: null };
  },
  computed: {
    isImage() {
      return isImage(this.data);
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
    onNameClick() {
      this.$connect.run("openDictory", { path: this.data });
    },
    onDeleteClick() {
      let path = this.data;
      this.data = null;
      this.$connect.run("deleteFile", { path });
    }
  },
  created() {
    this.$connect.run("getFileInfo", { path: this.data }).then((res) => {
      this.info = res;
    });
  }
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
