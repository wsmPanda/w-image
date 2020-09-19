<template>
  <div class="layout">
    <div class="layout-slot layout-slot-left">
      <slot name="left"></slot>
    </div>

    <div class="layout-slot layout-center">
      <slot> <slot name="center"></slot></slot>
    </div>

    <div class="layout-slot">
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
  height: 100%;
  width: 100%;
}
.layout-center {
  flex: 1;
}
.layout-slot {
  overflow: auto;
}
.layout-slot-left{
  width: 30%;
}
</style>
