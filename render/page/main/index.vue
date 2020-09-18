<template>
  <div class="page-view">
    <Layout>
      <template slot="left">
        <button @click="onClick">select dir</button>
        <Tree @on-active="onTreeActive" :data="tree.sub"></Tree>
      </template>
      <template slot="center">
        <ImageList
          class="main-image-list"
          :data="images"
          :path="testPath"
        ></ImageList>
      </template>
    </Layout>
  </div>
</template>

<script>
import Tree from "render/components/tree";
import ImageList from "render/components/image-file-list";
import Layout from "render/layout";
import Connect from "render/connect";
export default {
  components: { ImageList, Layout, Tree },
  data() {
    return {
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
      tree: [],
      testPath: "/Users/wangsongmao/Downloads"
    };
  },
  methods: {
    async onClick() {
      Connect.getTree().then((res) => {
        this.tree = res;
      });
    },
    onTreeActive({ path }) {
      console.log(path);
      //ipcRenderer.send("get-tree-files", { path });
    }
  },
  created() {
    this.onClick();
  }
};
</script>
<style lang="less">
.page-view {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  .main-image-list {
    padding: 4px;
  }
}
</style>
