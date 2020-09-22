<template>
  <div class="image-list">
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
    height: { type: Number, default: 200 },
    column: { type: Number, default: 3 },
    data: Array,
    path: String,
    showName: Boolean,
    // fall table
    layout: { type: String, default: "table" }
  },
  components: { Thumbnail },
  data() {
    return {
      active: null
    };
  },
  computed: {
    thumbnailStyle() {
      return {
        paddingTop: `${this.padding}px`,
        paddingLeft: `${this.padding}px`,
        paddingRight: `${this.padding}px`,
        marginBottom: `${this.padding}px`,
        height: `${this.height}px`,
        width: `${100 / this.column}%`
      };
    }
  }
};
</script>

<style lang="less">
.image-list {
  display: flex;
  flex-wrap: wrap;
  .image-list-item {
    &:hover {
      box-shadow: 0 0 2px #666;
    }
    &.active {
      //outline: 1px solid #2955c6;
      background: #eff5ff;
    }
  }
}
</style>
