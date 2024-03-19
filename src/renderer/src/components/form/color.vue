<template>
  <ColorPicker
    ref="input"
    :modelValue="value || ''"
    @update:modelValue="input"
    :disabled="field.disabled"
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
