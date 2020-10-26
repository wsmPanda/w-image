<template>
  <div class="checklist">
    <div class="checklist-box" v-if="$main.config && $main.config.image">
      <Thumbnail
        v-for="item of data"
        :key="item"
        :src="item"
        :showCheck="false"
        :style="thumbnailStyle"
      ></Thumbnail>
    </div>
    <div class="checklist-tool">
      <<<<<<< HEAD
      <Button icon="ios-archive" @click="onCollect"></Button>
      =======
      <Button icon="md-download" @click="onOutput"></Button>
      <Button icon="md-bookmarks" @click="onCollect"></Button>
      >>>>>>> f069200... feat: 添加收藏导出
    </div>
  </div>
</template>

<script>
import Thumbnail from "../../components/thumbnail";

export default {
  inject: ["$config", "$main"],
  components: { Thumbnail },
  props: {
    data: {}
  },
  data() {
    return {
      checkZoom: 2
    };
  },
  computed: {
    thumbnailStyle() {
      return {
        paddingTop: `${this.$main.config.image.padding}px`,
        paddingLeft: `${this.$main.config.image.padding}px`,
        paddingRight: `${this.$main.config.image.padding}px`,
        marginBottom: `${this.$main.config.image.margin}px`,
        height: `${this.$main.config.image.height / this.checkZoom}px`,
        minHeight: `${this.$main.config.image.height / this.checkZoom}px`,
        width: `${100 / this.$main.config.image.column / this.checkZoom}%`
      };
    }
  },
  methods: {
    onCollect() {
      this.$connect.addData("collect", {
        name: "collect",
        files: this.data
      });
    },
    onOutput() {
      this.$connect.run("copyToDictory", { data: this.data });
    }
  },
  created() {}
};
</script>

<style lang="less">
.checklist {
  width: 80vw;
}
.checklist-box {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  overflow: hidden;
}
</style>
