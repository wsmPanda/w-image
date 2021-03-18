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
      actions: [
        {
          name: "重命名",
          code: "rename"
        },
        {
          name: "更改后缀",
          code: "suffix"
        },
        {
          name: "删除",
          code: "delete",
          form: []
        },
        {
          name: "移动",
          code: "remove"
        },
        {
          name: "复制",
          code: "copy"
        },
        {
          name: "退壳",
          code: "shell"
        },
        {
          name: "清理空目录",
          code: "clear"
        },
        {
          name: "执行命令行",
          code: "command"
        }
      ]
    };
  },
  methods: {},
  created() {}
};
</script>

<style lang="less"></style>
