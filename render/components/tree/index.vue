<template>
  <div>
    <TreeItem
      v-for="(item, index) of data"
      :data="item"
      :key="index"
    ></TreeItem>
  </div>
</template>

<script>
import TreeItem from "./item";
export default {
  props: {
    data: Array
  },
  components: { TreeItem }
};
</script>

<style></style>
