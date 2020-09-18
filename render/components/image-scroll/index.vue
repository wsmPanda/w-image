<template>
  <div class="image-scroll">
    <Thumbnail
      class="image-list-item"
      @click.native="active = item"
      v-for="(item, index) of data"
      :class="{ active: active === item }"
      :src="path + '/' + item"
      :style="thumbnailStyle"
      :key="index"
    ></Thumbnail>
  </div>
</template>

<script>
import Thumbnail from "../thumbnail";
/* TODO:
规划高性能版，使用render方法细粒度控制渲染和滚动
强化异步渲染设置
*/
export default {
  props: {
    margin: { type: Number, default: 4 },
    padding: { type: Number, default: 4 },
    height: { type: Number, default: 100 },
    column: { type: Number, default: 2 },
    data: Array,
    path: String,
    showName: Boolean
  },
  components: { Thumbnail },
  data() {
    return {
      active: null
    };
  },
  computed: {
    thumbnailStyle() {
      return {};
    }
  }
};
</script>

<style lang="less">
.image-scroll {
  .image-list-item {
    width: 100%;
    &:hover {
      box-shadow: 0 0 2px #666;
    }
    &.active {
      outline: 1px solid #2955c6;
    }
  }
}
</style>
