<template>
  <Popper ref="popper" class="contextmenu">
    CONTEXT MENU
  </Popper>
</template>

<script>
import Popper from "../popper";
export default {
  components: { Popper },
  methods: {
    show(e) {
      this.$refs.popper.setPositionMouse(e);
    }
  },
  created() {}
};
</script>

<style lang="less">
.contextmenu {
  background: #fafafa;
  position: absolute;
  top: 10px;
  left: 10px;
  min-height: 40px;
  min-width: 120px;
  box-shadow: 0 0 2px #ddd;
  border: 1px solid #ddd;
}
</style>
