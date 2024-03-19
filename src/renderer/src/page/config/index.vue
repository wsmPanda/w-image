<template>
  <div class="config-view">
    <Tabs v-model:value="active" :items="tabs">
      <template #image>
        <DataForm v-if="data.image" v-model:value="data.image" :model="model.image"></DataForm
      ></template>
      <template #video>
        <DataForm v-if="data.video" v-model:value="data.video" :model="model.video"></DataForm
      ></template>
      <template #common>
        <div>
          存储位置：<a @click="toDB">{{ storePath }}</a>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script>
import DataForm from "render/components/form/index.vue"
import { Switch as _Switch } from "view-ui-plus"
import Tabs from "render/components/tabs/index.vue"
import { markRaw } from "vue"
const Switch = markRaw(_Switch)
export default {
  components: { DataForm, Tabs },
  props: {
    data: Object
  },
  data() {
    return {
      active: "image",
      storePath: "",
      show: false,
      tabs: [
        {
          name: "图片设置",
          value: "image",
          icon: "md-image"
        },
        {
          name: "视频设置",
          value: "video",
          icon: "md-videocam"
        },
        {
          name: "通用设置",
          value: "common",
          icon: "md-settings"
        }
      ],
      model: {
        image: {
          fields: [
            { label: "padding", key: "padding", type: "number" },
            { label: "margin", key: "margin", type: "number" },
            { label: "文件列数", key: "column", type: "number" },
            { label: "文件高度", key: "height", type: "number" },
            {
              label: "展示空目录",
              key: "showEmptyFolder",
              component: Switch
            },
            {
              label: "目录折行显示",
              key: "folderNameWrap",
              component: Switch
            },
            {
              label: "显示非图片文件",
              key: "showAllFile",
              component: Switch
            },
            {
              label: "显示文件名",
              key: "showFileName",
              component: Switch
            },
            {
              label: "目录读取长度",
              key: "readStep",
              type: "number"
            },
            {
              label: "目录翻页高度",
              key: "turnHeight",
              type: "number"
            },
            {
              label: "文件拖拽",
              key: "fileDrag",
              component: Switch
            }
          ]
        },
        video: {
          fields: [
            {
              label: "播放器",
              key: "player",
              type: "radio",
              data: [
                { name: "默认", value: "video" },
                { name: "ffmpeg", value: "ff" }
              ]
            },
            {
              label: "自动播放",
              key: "autoPlay",
              component: Switch
            },
            {
              label: "滚轮控制进度",
              key: "wheelScroll",
              component: Switch
            },
            {
              label: "自动生成截图",
              key: "autoShoot",
              component: Switch
            },
            {
              label: "截图数量",
              key: "shootCount",
              type: "number",
              disabled: true
            },
            {
              label: "截图最大宽度",
              key: "shootSize",
              type: "number",
              disabled: true
            }
          ]
        }
      }
    }
  },
  watch: {
    value(v) {
      if (v !== this.show) {
        this.show = v
      }
    },
    show(v) {
      if (v !== this.value) {
        this.$emit("update:value", v)
      }
    }
  },
  methods: {
    toDB() {
      shell.openPath(this.storePath)
    },
    onSubmit() {
      this.$emit("change", this.data)
    }
  },
  async mounted() {
    this.storePath = await Connect.run("getStorePath")
  }
}
</script>

<style lang="less">
div.ivu-poptip-body {
  padding: 0;
}
.config-view {
  padding: 0;
}
</style>
