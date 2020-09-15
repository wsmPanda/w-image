<template>
  <div class="layout">
    <div>
      <slot name="left"></slot>
    </div>

    <div class="layout-center">
      <slot> <slot name="center"></slot></slot>
    </div>

    <div>
      <slot> <slot name="right"></slot></slot>
    </div>
  </div>
</template>

<script>
/*
TODO：寻找合适滚动条样式/插件

*/
export default {
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="less">
.layout {
  display: flex;
}
.layout-center {
  flex: 1;
}
</style>
