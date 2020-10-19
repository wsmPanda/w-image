<template>
  <video class="video" controls="1" height="300" autoplay muted>
    <source :src="'file://' + data" type="video/mp4" />
  </video>
</template>

<script>
export default {
  props: {
    data: {},
  },
};
</script>

<style lang="less">
.video {
  width: 100%;
}
</style>