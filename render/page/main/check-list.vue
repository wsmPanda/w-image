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
      <Button icon="md-transh" size="small" @click="onClear">清空</Button>
      <Button icon="md-transh" size="small" @click="onDeleteFile"
        >批量删除</Button
      >
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
    data: {},
  },
  data() {
    return {
      checkZoom: 2,
    };
  },
  computed: {
    imageConfig() {
      return this.$main.config.image;
    },
    thumbnailStyle() {
      return {
        paddingTop: `${this.imageConfig.padding}px`,
        paddingLeft: `${this.imageConfig.padding}px`,
        paddingRight: `${this.imageConfig.padding}px`,
        marginBottom: `${this.imageConfig.margin}px`,
        height: `${this.imageConfig.height / this.checkZoom}px`,
        minHeight: `${this.imageConfig.height / this.checkZoom}px`,
        width: `${100 / this.imageConfig.column / this.checkZoom}%`,
      };
    },
  },
  methods: {
    onCollect() {
      this.$connect.addData("collect", {
        name: `${Time.toTime(new Date())}`,
        files: this.data,
        createTime: +new Date(),
      });
      this.$main.$emit("collectChange");
      this.$checkList.cleanCheck();
    },
    onDelete(index) {
      let row = this.data[index];
      this.$connect.deleteData("collect", {
        code: "createTime",
        value: row.createTime,
      });
      this.data.splice(index, 1);
    },
    onOutput() {
      this.$connect.run("copyToDictory", { data: this.data });
      this.$checkList.cleanCheck();
    },
    onClear() {
      this.$checkList.cleanCheck();
    },
    onDeleteFile() {
      this.$connect.run("deleteFiles", { data: this.data });
      this.$checkList.cleanCheck();
    },
  },
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
