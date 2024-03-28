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
          <span v-if="info"> {{ sizeText }} </span>
          <span v-if="width"> {{ width }}*{{ height }} </span>
        </div>
        <div class="file-check" v-if="$main.showCheck">
          <Checkbox
            v-for="(item, index) of $main.checkList"
            :key="index"
            :modelValue="$main.isCheck(data, index)"
            @click.native.prevent="$main.check(data, index)"
          ></Checkbox>
          <Checkbox
            :key="$main.checkList.length"
            :modelValue="$main.isCheck(data, $main.checkList.length)"
            @click.native.prevent="$main.check(data, $main.checkList.length)"
          ></Checkbox>
        </div>
        <Button @click.native="onDeleteClick" size="small">
          <Icon type="md-trash"></Icon>
        </Button>
      </div>
    </div>

    <PdfViewer v-if="isPdf" :src="data" />
    <ImageViewer
      v-else-if="isImage"
      :full="fullScreen"
      class="image-viewer-img"
      :data="data"
      @load="onLoad"
      @fullClose="fullScreen = false"
    />
    <template v-else-if="isVideo">
      <VideoViewer :key="data" :data="data"></VideoViewer>
      >
    </template>
  </div>
</template>

<script>
import { isImage, isPdf, isVideo } from "render/util"
import VideoViewer from "./video-viewer/index.vue"
import PdfViewer from "./pdf-viewer/index.vue"
import ImageViewer from "./image-viewer/index.vue"
export default {
  inject: ["$main"],
  components: { VideoViewer, ImageViewer, PdfViewer },
  props: {
    data: {}
  },
  data() {
    return { info: null, fullScreen: false, width: 0, height: 0 }
  },
  computed: {
    videoViewerType() {
      return this.$main.config && this.$main.config.video && this.$main.config.video.player
    },
    isImage() {
      return isImage(this.data)
    },
    isVideo() {
      return isVideo(this.data)
    },
    isPdf() {
      return isPdf(this.data)
    },
    sizeText() {
      let text = ""
      let size = (this.info && this.info.size) || 0
      let number = size
      if (size <= 1024 * 1024) {
        number = size / 1024
        text = "K"
      } else if (size <= 1024 * 1024 * 1024) {
        number = size / (1024 * 1024)
        text = "M"
      } else {
        number = size / (1024 * 1024 * 1024)
        text = "G"
      }
      return number.toFixed(2) + text
    }
  },
  methods: {
    onLoad(e) {
      this.$emit("load", e)
      this.width = e.target.naturalWidth
      this.height = e.target.naturalHeight
    },
    onFullScreen() {
      this.fullScreen = true
    },
    onNameClick() {
      window.ConnectRun("openDictory", { path: this.data })
    },
    onDeleteClick() {
      let path = this.data
      this.data = null
      setTimeout(() => {
        window.ConnectRun("deleteFile", { path })
      })
    }
  },
  beforeMount() {
    window.ConnectRun("getFileInfo", { path: this.data }).then((res) => {
      this.info = res
    })
  }
}
</script>

<style lang="less">
.image-viewer {
  padding: 8px;
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  .file-check {
  }
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
    span {
      margin-right: 8px;
    }
  }
  .file-expand {
    margin-right: 8px;
  }
}
</style>
