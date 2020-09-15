<template>
  <div class="hello">
    <Layout>
      <template slot="left">
        <button @click="onClick">select dir</button>
        <Tree :data="tree.sub"></Tree>
      </template>
      <template slot="center">
        <ImageList :data="images"></ImageList>
      </template>
    </Layout>
  </div>
</template>

<script>
import Tree from "./tree";
import ImageList from "./image-list";
import Layout from "../layout";
const { ipcRenderer } = window.require("electron");
export default {
  components: { ImageList, Layout, Tree },
  data() {
    return {
      images: [],
      tree: []
    };
  },
  methods: {
    async onClick() {
      //ipcRenderer.send("open-file-dialog");
      ipcRenderer.send("get-tree");
    }
  },
  created() {
    ipcRenderer.on("selected-directory", (event, path) => {
      this.images = path;
    });
    ipcRenderer.on("get-tree", (event, path) => {
      this.tree = path;
    });
  }
};
</script>
