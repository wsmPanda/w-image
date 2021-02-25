<template>
  <div>
    {{ src }}
    <div id="webviewer" ref="viewer"></div>
  </div>
</template>

<script>
// import WebViewer from "@pdftron/webviewer";
import "@pdftron/webviewer/webviewer.min.js";

export default {
  name: "WebViewer",
  props: { src: { type: String } },
  mounted() {
    const path = `/webviewer`;
    window
      .WebViewer({ path, theme: "dark" }, this.$refs.viewer)
      .then(async (instance) => {
        instance.setTheme("dark");
        instance.disableElements(["downloadButton"]);
        // 由于WebViewer会阻止file协议，以此采用别用files跳过验证
        instance.loadDocument("files://" + this.src);
      });
  }
};
</script>

<style>
#webviewer {
  height: 800px;
}
</style>
