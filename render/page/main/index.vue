<template>
  <div class="page-view">
    <div class="page-header">
      <Dropdown trigger="click">
        <a href="javascript:void(0)">
          <Button icon="md-settings"></Button>
        </a>
        <DropdownMenu slot="list">
          <Config v-if="config" :data="config"></Config>
        </DropdownMenu>
      </Dropdown>
    </div>
    <Layout class="page-content" ref="layout">
      <template slot="left">
        <Button @click="onClick" icon="md-add-circle" size="small"></Button>
        <Tree @on-active="onTreeActive" :data="dictory"></Tree>
      </template>
      <template slot="center">
        <ImageList
          :imageSetting="config && config.image"
          ref="imageList"
          class="main-image-list"
          :height="listHeight"
        ></ImageList>
      </template>
    </Layout>
  </div>
</template>

<script>
import Tree from "render/components/dictory-tree";
import ImageList from "render/components/big-image-list";
import Layout from "render/layout";
import Connect from "render/connect";
import { Dropdown, DropdownMenu, Button } from "iview";
import Config from "../config";
export default {
  components: {
    ImageList,
    Layout,
    Tree,
    Button,
    Dropdown,
    Config,
    DropdownMenu
  },
  data() {
    return {
      configShow: false,
      listHeight: 300,
      config: null,
      dictory: [],
      tools: [
        { name: "添加目录" },
        { name: "管理模式" },
        { name: "全部打开/全部关闭" },
        {
          name: "显示模式",
          list: [{ name: "列表" }, { name: "详情" }, { name: "图标" }]
        }
      ],

      images: [],
      tree: []
    };
  },
  watch: {},
  methods: {
    async onClick() {
      let path = await Connect.selectDictiry();
      await Connect.addDictiry({ path });
      this.updateDictory();
    },
    async updateDictory() {
      this.dictory = await Connect.getDictory();
    },
    onTreeActive({ path }) {
      Connect.getTreeFiles({ path }).then((res) => {
        this.$refs.imageList.setData(this.floaFileTree(res));
      });
    },
    floaFileTree(data, path) {
      let list = data.files.map((p) => (path || data.path) + "/" + p);
      if (data.sub) {
        data.sub.forEach((item) => {
          let subPath = (path || data.path) + "/" + item.path;
          list.push({
            path: subPath,
            name: item.path
          });
          list = list.concat(this.floaFileTree(item, subPath));
        });
      }
      return list;
    },
    onResize() {
      this.listHeight = this.$refs.layout && this.$refs.layout.$el.clientHeight;
    }
  },
  mounted() {
    this.onResize();
  },
  created() {
    Connect.getConfig().then((res) => {
      if (!res.image) {
        res.image = { image: {} };
      }
      this.config = res;
      this.$watch("config", {
        deep: true,
        handler(v) {
          console.log("????");
          Connect.setConfig({ data: v });
        }
      });
    });
    this.updateDictory();
    window.addEventListener("resize", () => {
      this.onResize();
    });
  }
};
</script>
<style lang="less">
.page-view {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .page-header {
    padding: 8px;
  }
  .page-content {
    flex: 1;
    overflow: hidden;
  }
  .main-image-list {
    height: 100%;
    overflow: hidden;
  }
  .layout-center {
    height: 100%;
    overflow: hidden;
  }
}
</style>
