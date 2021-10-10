<template>
  <div class="tree tree-common" @contextmenu="onContextmenu">
    <TreeItem
      v-for="(item, index) of data"
      :data="item"
      :key="index"
      :path="item.path"
      @remove="removeChildren(index)"
    >
      <template v-slot:name="{ data, deep, open }">
        <slot name="name" :data="data" :deep="deep" :open="open"></slot
      ></template>
    </TreeItem>
    <NameInput
      ref="nameInput"
      v-if="nameEditing"
      :value="editData[nameKey]"
      @blur="saveName"
    ></NameInput>
    <Contextmenu ref="menu" :params="contextData" :menu="currentMenu"
      ><slot name="menu"></slot
    ></Contextmenu>
  </div>
</template>

<script>
import Contextmenu from "./contextmenu";
import NameInput from "../name-input";
import TreeItem from "./item";
import Dom from "render/util/dom";

export default {
  provide() {
    return {
      $treeRoot: this
    };
  },
  components: { TreeItem, Contextmenu, NameInput },
  props: {
    data: Array,
    multipleSelect: Boolean,
    defaultOpen: Boolean,
    selectable: { type: Boolean, default: true },
    idKey: { type: String, default: "path" },
    subKey: { type: String, default: "sub" },
    nameKey: { type: String },
    menu: Function,
    icon: {},
    rename: Boolean,
    dragable: Boolean,
    subGetter: Function,
    initActive: {},
    selected: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      active: this.initActive,
      nameEditing: false,
      editData: null,
      menuShow: false,
      contextKey: null,
      contextData: null,
      activeReady: true,
      currentMenu: []
    };
  },
  methods: {
    onItemClick(data) {
      this.setContextNode();
      this.active = data[this.idKey];
      this.$emit("on-active", { id: this.active, data });
    },
    onItemCheck(data) {
      let id = data[this.idKey];
      let index = this.selected.indexOf(id);
      if (index >= 0) {
        this.selected.splice(index, 1);
        this.unselectSubItems(data[this.subKey]);
      } else {
        this.selected.push(id);
        if (data[this.subKey]) {
          this.selectSubItems(data[this.subKey]);
        }
      }
      this.$emit("on-select", this.selected);
    },
    unselectSubItems(list = []) {
      list.forEach(data => {
        let id = data[this.idKey];
        let index = this.selected.indexOf(id);
        if (index >= 0) {
          this.selected.splice(index, 1);
        }
        if (data[this.subKey]) {
          this.unselectSubItems(data[this.subKey]);
        }
      });
    },
    selectSubItems(list = []) {
      list.forEach(data => {
        let id = data[this.idKey];
        let index = this.selected.indexOf(id);
        if (index < 0) {
          this.selected.push(id);
          if (data[this.subKey]) {
            this.selectSubItems(data[this.subKey]);
          }
        }
      });
    },
    scrollToActive() {},
    saveName(e) {
      this.$emit("on-remove", e);
      this.nameEditing = false;
    },
    setContextNode(key) {
      this.contextKey = key;
    },
    getContextData(e) {
      let data = null;
      this.setContextNode();
      let el = Dom.getParentEle(
        e,
        item => {
          return item && item.classList.contains("tree-item");
        },
        this.$el
      );
      if (el) {
        let key = el.dataset.key;
        let node = this.node[key];
        if (node) {
          this.setContextNode(key);
          data = node.data;
        }
      }
      return data;
    },
    refreshNode(key) {
      let node = this.node[key];
      if (node) {
        node.onRefresh();
      }
    },
    onContextmenu(e) {
      this.contextData = this.getContextData(e.target);
      this.currentMenu = this.menu && this.menu(this.contextData);
      this.$refs.menu.show(e);
      this.$emit("context-menu", e);
    },
    removeNode(key) {
      let node = this.node[key];
      if (node) {
        node.removeNode();
      }
    },
    removeChildren(index) {
      this.data.splice(index, 1);
    }
  },
  created() {
    this.node = {};
    if (this.initActive) {
      this.activeReady = false;
    }
  }
};
</script>

<style lang="less">
.tree-common {
  position: relative;
}
</style>
