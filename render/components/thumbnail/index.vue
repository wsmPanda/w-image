<template>
  <div class="thumbnail">
    <img class="thumbnail-img" :src="'file://' + src" />
    <div class="thumbnail-name">{{ name }}</div>
  </div>
</template>

<script>
export default {
  props: { src: String },
  computed: {
    name() {
      return this.src && this.src.split("/").pop();
    }
  }
};
</script>

<style lang="less">
.thumbnail {
  padding: 4px;
  padding-bottom: 30px;
  box-sizing: border-box;
}
.thumbnail-img {
  object-fit: contain;
  object-fit: contain;
  height: 100%;
  width: 100%;
  margin-bottom: 30px;
}
.thumbnail-name {
  margin-top: -30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
}
</style>
