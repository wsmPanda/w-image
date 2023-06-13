<template>
  <i-input  size="small" :modelValue="value" @update:modelValue="input">
    <Icon slot="append" type="md-folder"></Icon>
  </i-input>
</template>

<script>
import Base from "./field";
export default {
  extends: Base
};
</script>

<style></style>
