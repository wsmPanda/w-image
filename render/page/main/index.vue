<template>
  <div class="page-view">
    <Layout>
      <template slot="left">
        <button @click="onClick">select dir</button>
        <Tree @on-active="onTreeActive" :data="dictory"></Tree>
      </template>
      <template slot="center">
        <ImageList
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
export default {
  components: { ImageList, Layout, Tree },
  data() {
    return {
      listHeight: 300,
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
    }
  },
  mounted() {
    this.listHeight = this.$el.clientHeight;
  },
  created() {
    this.updateDictory();
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
  .layout-center {
    height: 100%;
    overflow: hidden;
  }
}
</style>
