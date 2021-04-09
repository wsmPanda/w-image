<template>
  <ColorPicker
    ref="input"
    :value="value || ''"
    @input="input"
    transfer
  ></ColorPicker>
</template>

<script>
import Base from "./field";
export default {
  extends: Base
};
</script>

<style></style>
