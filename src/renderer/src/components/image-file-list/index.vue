<template>
  <div class="image-file-list">
    <div class="image-file-list-title">
      <Icon @click.native="open = !open" :type="open ? 'ios-arrow-up' : 'ios-arrow-forward'"></Icon>
      {{ data.path }}
    </div>
    <div v-if="data.files && data.files.length" v-show="open">
      <ImageList :data="data.files" :path="filePath"></ImageList>
    </div>
    <div v-if="data.sub && data.sub.length" v-show="open">
      <imageFileList v-for="item of data.sub" :key="item.path" :data="item" :path="filePath"></imageFileList>
    </div>
  </div>
</template>

<script>
import ImageList from "render/components/image-list/index.vue";
import { Icon } from "view-ui-plus";
export default {
  name: "imageFileList",
  components: { ImageList, Icon },
  props: {
    data: {},
    path: String,
  },
  computed: {
    filePath() {
      let res = this.path
        ? `${this.path}/${this.data.path}`
        : `${this.data.path}`;
      return res;
    },
  },
  data() {
    return {
      open: true,
    };
  },
  methods: {},
};
</script>

<style lang="less">
.image-file-list-title {
  padding: 2px 0;
  margin: 4px 0;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  word-break: break-all;
}
</style>
