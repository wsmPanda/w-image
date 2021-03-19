<template>
  <div>
    <table>
      <tr></tr>
    </table>
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
      oparations: [
        {
          name: "删除",
          color: "#ff9900"
        },
        {
          name: "移动",
          color: "#19be6b"
        },
        {
          name: "复制",
          color: "#2db7f5"
        },
        {
          name: "重命名",
          color: "#2d8cf0"
        }
      ]
    };
  },
  methods: {},
  created() {}
};
</script>

<style lang="less"></style>
