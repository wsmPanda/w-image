<template>
  <div class="checklist" @click.stop>
    {{ value }}
    <Tabs type="card" :modelValue="value" @update:modelValue="$emit('update:value', $event)">
      <TabPane
        v-for="(tab, tabIndex) of data"
        :key="tabIndex"
        :label="(tabIndex + 1).toString()"
        :name="tabIndex.toString()"
      >
        <div class="checklist-box" v-if="$main.config && $main.config.image">
          <Thumbnail
            v-for="(item, index) of tab"
            :key="item"
            :src="item"
            :style="thumbnailStyle"
            :showCheck="false"
            showDelete
            @delete="onDelete(index)"
          ></Thumbnail>
        </div>
      </TabPane>
      <TabPane
        v-if="!(data[data.length - 1] && !data[data.length - 1].length)"
        :key="data.length"
        :label="(data.length + 1).toString()"
        :name="data.length.toString()"
      >
      </TabPane>
    </Tabs>

    <div class="checklist-tool">
      <Button icon="ios-archive" size="small" @click="onCollect">收藏</Button>
      <Button icon="ios-archive" size="small" @click="onCollect">移出收藏</Button>
      <Button icon="md-download" size="small" @click="onOutput">复制</Button>
      <Button icon="md-return-right" size="small" @click="onMove">移动</Button>
      <Button icon="ios-undo" size="small" @click="onUndo">恢复</Button>

      <Button icon="md-trash" size="small" @click="onClear">清空</Button>
      <Button icon="md-close" size="small" @click="onDeleteFile">批量删除</Button>
    </div>
  </div>
</template>

<script>
import Thumbnail from "../../components/thumbnail/index.vue"
import { Time } from "../../util/time"
export default {
  inject: ["$config", "$main", "$checkList"],
  components: { Thumbnail },
  props: {
    value: {},
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      checkZoom: 2,
      backData: []
    }
  },
  computed: {
    imageConfig() {
      return this.$main.config.image
    },
    thumbnailStyle() {
      return {
        paddingTop: `${this.imageConfig.padding}px`,
        paddingLeft: `${this.imageConfig.padding}px`,
        paddingRight: `${this.imageConfig.padding}px`,
        marginBottom: `${this.imageConfig.margin}px`,
        height: `${this.imageConfig.height / this.checkZoom}px`,
        minHeight: `${this.imageConfig.height / this.checkZoom}px`,
        width: `${100 / this.imageConfig.column / this.checkZoom}%`
      }
    },
    activeData() {
      return this.data[this.value]
    }
  },
  methods: {
    cleanCheck() {
      this.backData[this.value] = [...this.data[this.value]]
      this.$checkList.cleanCheck()
    },
    onUndo() {
      if (this.backData[this.value]) {
        this.$checkList.resetData(this.backData[this.value] || [])
      }
    },
    onCollect() {
      this.$connect.addData("collect", {
        name: `${Time.toTime(new Date())}`,
        files: this.activeData,
        createTime: +new Date()
      })
      this.$main.$emit("collectChange")
      this.cleanCheck()
    },
    onDelete(index) {
      let row = this.activeData[index]
      this.$connect.deleteData("collect", {
        code: "createTime",
        value: row.createTime
      })
      this.activeData.splice(index, 1)
    },
    getPathList(list) {
      return list.map((item) => item.path || item)
    },
    onOutput() {
      window.ConnectRun("copyToDictory", {
        data: this.getPathList(this.activeData)
      })
      this.cleanCheck()
    },
    onMove() {
      window.ConnectRun("moveToDictory", {
        data: this.getPathList(this.activeData)
      })
      // this.cleanCheck();
    },
    onClear() {
      this.cleanCheck()
    },
    onDeleteFile() {
      window.ConnectRun("removeFiles", {
        data: this.getPathList(this.activeData)
      })
      this.cleanCheck()
    }
  },
  beforeMount() {}
}
</script>

<style lang="less">
.checklist {
  width: 80vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}
.checklist-box {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  overflow: auto;
}
.checklist-tool {
  padding: 8px 8px 4px;
}
</style>
