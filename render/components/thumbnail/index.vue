<template>
  <div class="thumbnail">
    <img class="thumbnail-img" :src="'file://' + src" />
    <div v-if="showName" class="thumbnail-name" :title="name">{{ name }}</div>
  </div>
</template>

<script>
export default {
  props: { src: String, showName: { type: Boolean, default: true } },
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
  text-align: center;
}
</style>
