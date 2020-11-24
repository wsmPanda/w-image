<template>
  <div class="tree-panel">
    <div class="tree-header">
      <div class="tree-header-left">
        <Button @click="onAddDictiry" icon="md-add" size="small"></Button>
        <Button @click="onAddGroup" icon="md-add-circle" size="small" />
        <Button
          @click="onTreeEdit"
          icon="md-create"
          :type="editing ? 'primary' : 'default'"
          :ghost="editing"
          size="small"
        ></Button>
        <Button @click="updateDictory" icon="md-refresh" size="small"></Button>
      </div>

      <div class="tree-header-right">
        <Button @click="updateDictory" icon="md-refresh" size="small"></Button>
      </div>
    </div>
    <Tree
      ref="tree"
      class="tree-body"
      :initActive="active"
      @on-active="onTreeActive"
      @on-fresh="onTreeFersh"
      :data="dictory"
      :edit="editing"
    ></Tree>
  </div>
</template>

<script>
import Tree from "render/components/dictory-tree";
import { functionDebounce, isMac } from "render/util";

export default {
  inject: ["$main"],
  components: { Tree },
  props: {
    active: {}
  },
  data() {
    return {
      dictory: [],
      editing: false
    };
  },
  methods: {
    onAddGroup() {
      let data = {
        name: "group",
        type: "group",
        sub: []
      };
      this.dictory.push(data);
      this.$connect.addData("dictory", data);
    },
    onTreeEdit() {
      this.editing = !this.editing;
    },
    async updateDictoryCache() {
      try {
        this.dictory = await this.$connect.run("getDictoryCache");
      } catch (ex) {
        console.error(ex);
      }
      if (!this.dictory || !this.dictory.length) {
        this.updateDictory();
      }
    },
    async onAddDictiry() {
      let path = await this.$connect.run("selectDictory");
      await this.$connect.run("addDictory", { path });
      this.addDictory(path);
    },
    async updateDictory() {
      let dictoryList = await this.$connect.run("getDictory");
      this.dictory = this.dictoryParse(dictoryList);
    },
    onTreeFersh(data) {
      this.onTreeActive(data, false);
    },
    onTreeActive(data, cache) {
      this.$emit("on-active", { data, cache });
    },
    dictoryParse(data) {
      let list = [];
      for (let dictory of data) {
        let path = dictory.path.split(/\\|\//);
        if (path[0] === "") {
          path.splice(0, 1);
        }
        let node = list;
        let pathText = "";
        if (isMac) {
          pathText = "/";
        }
        path.forEach((item, index) => {
          let folder = node.find((i) => i.name === item);
          pathText += (pathText ? "/" : "") + item;
          if (!folder) {
            folder = {
              open: index !== path.length - 1,
              name: item,
              path: pathText,
              type: index !== path.length - 1 ? "set" : "dictory",
              sub: []
            };
            node.push(folder);
          }
          node = folder.sub;
        });
      }
      return this.mergeDictoryList(list);
    },
    addDictory(dir) {
      let path = dir.split(/\\|\//);
      if (path[0] === "") {
        path.splice(0, 1);
      }
      let node = this.dictory;
      let pathText = "";
      if (isMac) {
        pathText = "/";
      }
      path.forEach((item, index) => {
        pathText += (pathText ? "/" : "") + item;
        let folder = node.find(
          (i) => i.name === item || i.path.indexOf(pathText) === 0
        );
        if (!folder || folder.path === pathText) {
          if (!folder) {
            folder = {
              open: index !== path.length - 1,
              name: item,
              path: pathText,
              type: index !== path.length - 1 ? "set" : "dictory",
              sub: []
            };
            node.push(folder);
          }
          node = folder.sub;
        }
      });
    },
    mergeDictoryList(list) {
      let res = [];
      if (list.length) {
        for (let item of list) {
          let sub = this.mergeDictoryList(item.sub);
          if (sub.length === 1) {
            res.push({ ...sub[0], name: `${item.name}/${sub[0].name}` });
          } else {
            res.push({ ...item, sub });
          }
        }
      }
      return res;
    }
  },
  async created() {
    this.onTreeChange = functionDebounce(() => {
      this.$connect.run("saveDictoryCache", { data: this.dictory });
    });
    await this.updateDictoryCache();
    setTimeout(() => {
      this.$watch("dictory", {
        deep: true,
        handler() {
          this.onTreeChange();
        }
      });
    });
  }
};
</script>

<style lang="less">
.tree-panel {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .tree-header {
    padding: 8px;
    display: flex;
  }
  .tree-header-left {
    flex: 1;
  }
  .tree-body {
    flex: 1;
    overflow: auto;
  }
}
</style>
