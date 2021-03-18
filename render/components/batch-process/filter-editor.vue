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
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style lang="less"></style>
