<template>
  <div class="config-view">
    <Tabs v-model="active" :items="tabs">
      <Form
        slot="image"
        v-if="data.image"
        v-model="data.image"
        :model="model.image"
      ></Form
      ><Form
        slot="video"
        v-if="data.video"
        v-model="data.video"
        :model="model.video"
      ></Form>
    </Tabs>
  </div>
</template>

<script>
import Form from "render/components/form";
import { Switch } from "iview";
import Tabs from "render/components/tabs";
export default {
  components: { Form, Tabs },
  props: {
    data: Object
  },
  data() {
    return {
      active: "image",
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
            }
          ]
        }
      }
    };
  },
  watch: {
    value(v) {
      if (v !== this.show) {
        this.show = v;
      }
    },
    show(v) {
      if (v !== this.value) {
        this.$emit("input", v);
      }
    }
  },
  methods: {
    onSubmit() {
      this.$emit("change", this.data);
    }
  }
};
</script>

<style lang="less">
div.ivu-poptip-body {
  padding: 0;
}
.config-view {
  padding: 0;
}
</style>
