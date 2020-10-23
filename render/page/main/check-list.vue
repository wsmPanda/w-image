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
      <Button icon="md-bookmarks" @click="onCollect"></Button>
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
  computed: {
    thumbnailStyle() {
      return {
        paddingTop: `${this.$main.config.image.padding}px`,
        paddingLeft: `${this.$main.config.image.padding}px`,
        paddingRight: `${this.$main.config.image.padding}px`,
        marginBottom: `${this.$main.config.image.margin}px`,
        height: `${this.$main.config.image.height / 4}px`,
        minHeight: `${this.$main.config.image.height / 4}px`,
        width: `${100 / this.$main.config.image.column / 4}%`
      };
    }
  },
  methods: {
    onCollect() {}
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
