<template>
  <div>
    {{ src }}
    <div id="webviewer" ref="viewer"></div>
  </div>
</template>

<script>
import WebViewer from "@pdftron/webviewer";

export default {
  name: "WebViewer",
  props: { src: { type: String } },
  mounted() {
    const path = `/webviewer`;
    WebViewer({ path, initialDoc: this.src }, this.$refs.viewer).then(
      (instance) => {
        instance.loadDocument(this.src);
      }
    );
  }
};
</script>

<style>
#webviewer {
  height: 800px;
}
</style>
