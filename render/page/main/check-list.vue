<template>
  <div class="checklist">
    <div class="checklist-box" v-if="$main.config && $main.config.image">
      <Thumbnail
        v-for="(item, index) of data"
        :key="item"
        :src="item"
        :style="thumbnailStyle"
        :showCheck="false"
        showDelete
        @delete="onDelete(index)"
      ></Thumbnail>
    </div>
    <div class="checklist-tool">
      <Button icon="ios-archive" size="small" @click="onCollect">收藏</Button>
      <Button icon="md-download" size="small" @click="onOutput">复制</Button>
      <Button icon="md-return-right" size="small">移动</Button>
      <Button icon="md-transh" size="small">删除</Button>
    </div>
  </div>
</template>

<script>
import Thumbnail from "../../components/thumbnail";
import { Time } from "../../util/time";
export default {
  inject: ["$config", "$main", "$checkList"],
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
    imageConfig() {
      return this.$main.config.image;
    },
    thumbnailStyle() {
      return {
        paddingTop: `${this.imagaeConfig.padding}px`,
        paddingLeft: `${this.imagaeConfig.padding}px`,
        paddingRight: `${this.imagaeConfig.padding}px`,
        marginBottom: `${this.imagaeConfig.margin}px`,
        height: `${this.imagaeConfig.height / this.checkZoom}px`,
        minHeight: `${this.imagaeConfig.height / this.checkZoom}px`,
        width: `${100 / this.imagaeConfig.column / this.checkZoom}%`
      };
    }
  },
  methods: {
    onCollect() {
      this.$connect.addData("collect", {
        name: `${Time.toTime(new Date())}`,
        files: this.data,
        createTime: +new Date()
      });
      this.$main.$emit("collectChange");
      this.$checkList.cleanCheck();
    },
    onDelete(index) {
      let row = this.data[index];
      this.$connect.deleteData("collect", {
        code: "createTime",
        value: row.createTime
      });
      this.data.splice(index, 1);
    },
    onOutput() {
      this.$connect.run("copyToDictory", { data: this.data });
      this.$checkList.cleanCheck();
    }
  }
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
