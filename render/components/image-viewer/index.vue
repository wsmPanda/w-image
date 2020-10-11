<template>
  <div class="image-viewer">
    <img v-if="isImage" class="image-viewer-img" :src="'file://' + data" />
    <VideoViewer v-else :key="data" :data="data"></VideoViewer>
    <div>
      <a @click="onNameClick">{{ data }}</a>
      <Icon @click.native="onDeleteClick" type="md-trash"></Icon>
    </div>
  </div>
</template>

<script>
import { isImage } from "render/util";
import VideoViewer from "../video-viewer";
export default {
  components: { VideoViewer },
  props: {
    data: {},
  },
  computed: {
    isImage() {
      return isImage(this.data);
    },
  },
  methods: {
    onNameClick() {
      this.$connect.openDictory({ path: this.data });
    },
    onDeleteClick() {
      let path = this.data;
      this.data = null;
      this.$connect.openFileDelete({ path });
    },
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
