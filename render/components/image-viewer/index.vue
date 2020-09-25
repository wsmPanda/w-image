<template>
  <div class="image-viewer">
    <img class="image-viewer-img" :src="'file://' + data" />
    <div>{{ data }}</div>
  </div>
</template>

<script>
export default {
  props: {
    data: {}
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
