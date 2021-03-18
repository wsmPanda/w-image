<template>
  <div>
    editor
  </div>
</template>

<script>
export default {
  inject: ["$main"],
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      selectors: [
        {
          name: "收藏夹"
        },
        {
          name: "标签"
        },
        {
          name: "目录"
        }
      ]
    };
  },
  methods: {},
  created() {}
};
</script>

<style lang="less"></style>
