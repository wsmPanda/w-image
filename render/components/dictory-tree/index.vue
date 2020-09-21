<template>
  <div>
    <TreeItem
      v-for="(item, index) of data"
      :data="item"
      :key="index"
      :path="item.path"
    ></TreeItem>
  </div>
</template>

<script>
import TreeItem from "./dictory-item";
export default {
  provide() {
    return {
      $treeRoot: this
    };
  },
  components: { TreeItem },
  props: {
    data: Array
  },
  data() {
    return {
      active: null,
      selected: []
    };
  },
  methods: {
    onItemClick({ data, path }) {
      this.active = data;
      this.$emit("on-active", { data, path });
    }
  }
};
</script>

<style></style>
