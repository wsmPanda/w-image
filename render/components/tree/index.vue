<template>
  <div class="tree tree-common" @contextmenu="onContextmenu">
    <TreeItem
      v-for="(item, index) of data"
      :data="item"
      :key="index"
      :path="item.path"
    >
      <template v-slot:name="{ data }">
        <slot name="name" :data="data"></slot
      ></template>
    </TreeItem>
    <NameInput
      ref="nameInput"
      v-if="nameEditing"
      :value="editData[nameKey]"
      @blur="saveName"
    ></NameInput>
    <Contextmenu ref="menu"><slot name="menu"></slot></Contextmenu>
  </div>
</template>

<script>
import Contextmenu from "./contextmenu";
import NameInput from "../name-input";
import TreeItem from "./item";
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
    selected: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      active: null,
      nameEditing: false,
      editData: null,
      menuShow: false
    };
  },
  methods: {
    onItemClick(data) {
      this.active = data[this.idKey];
      this.$emit("on-active", { id: this.active, data });
    },
    onItemCheck(data) {
      let id = data[this.idKey];
      let index = this.selected.indexOf(id);
      if (index >= 0) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(id);
      }
      this.$emit("on-select");
    },
    scrollToActive() {},
    saveName(e) {
      this.$emit("on-remove", e);
      this.nameEditing = false;
    },
    onContextmenu(e) {
      this.$refs.menu.show(e);
      this.$emit("context-menu", e);
    }
  },
  created() {
    this.node = {};
  }
};
</script>

<style lang="less">
.tree-common {
  position: relative;
}
</style>
