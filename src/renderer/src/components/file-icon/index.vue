<template>
  <svg class="icon file-icon" aria-hidden="true">
    <use :xlink:href="iconSymbol"></use>
  </svg>
</template>

<script>
import "../../assets/icon/iconfont.js";
const FileIconMap = {
  png: "pic",
  jpg: "pic",
  svg: "pic",
  bmp: "pic",
  gif: "pic",
  mp4: "video",
  mov: "video",
  wmv: "video",
  flv: "video",
  avi: "video",
  mkv: "video",
  rmvb: "video",
  mp3: "music",
  xlsx: "excel_office",
  xls: "excel_office",
  docx: "word_office",
  doc: "word_office",
  pptx: "ppt_office",
  ppt: "ppt_office",
  css: "css",
  pdf: "pdf",
  zip: "zip",
  rar: "zip",
  "7z": "zip",
  "001": "zip",
  exe: "exe",
  "": "unknown",
  default: "txt"
};
export default {
  props: { type: String },
  computed: {
    iconSymbol() {
      return "#icon-file_" + (FileIconMap[this.type] || FileIconMap.default);
    }
  }
};
</script>

<style lang="less">
.file-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
