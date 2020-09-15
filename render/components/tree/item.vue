<template>
  <div class="tree-item" v-if="data && data.sub">
    {{ data.path }}
    <div v-if="data && data.sub" clas="tree-item-sub">
      <TreeItem
        v-for="(item, index) of data.sub"
        :data="item"
        :key="index"
      ></TreeItem>
    </div>
  </div>
</template>

<script>
export default {
  name: "TreeItem",
  props: { data: {} }
};
</script>

<style lang="less">
.tree-item {
  font-size: 12px;
  padding: 4px 4px 4px 8px;
}
</style>
